import argparse
import json
import shutil
from pathlib import Path
from urllib.parse import urlsplit

from dotenv import load_dotenv
from psycopg2 import sql

from db import get_connection
from utils import BACKEND_ROOT, ROOT, UPLOAD_ROOT


PRESERVED_TABLES = {"_prisma_migrations", "roles", "permissions", "admin_users"}
LOCAL_HOSTS = {"localhost", "127.0.0.1", "::1"}


def build_parser():
    parser = argparse.ArgumentParser(
        description="Reset ApniCars test data and uploads while preserving admin access"
    )
    parser.add_argument(
        "--yes",
        action="store_true",
        help="Skip the RESET confirmation prompt (localhost protection still applies)",
    )
    return parser


def database_target():
    load_dotenv(BACKEND_ROOT / ".env")
    import os

    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is missing from backend/.env")

    parsed = urlsplit(database_url)
    host = (parsed.hostname or "").lower()
    database = parsed.path.lstrip("/")
    if host not in LOCAL_HOSTS:
        raise RuntimeError(
            f"Reset refused: DATABASE_URL host '{host or 'unknown'}' is not local"
        )
    if not database:
        raise RuntimeError("Reset refused: DATABASE_URL has no database name")
    return host, database


def list_reset_tables(cursor):
    cursor.execute(
        """
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = current_schema()
        ORDER BY tablename
        """
    )
    return [name for (name,) in cursor.fetchall() if name not in PRESERVED_TABLES]


def protected_dependencies(cursor, reset_tables):
    cursor.execute(
        """
        SELECT child.relname, parent.relname
        FROM pg_constraint AS constraint_row
        JOIN pg_class AS child ON child.oid = constraint_row.conrelid
        JOIN pg_namespace AS child_namespace ON child_namespace.oid = child.relnamespace
        JOIN pg_class AS parent ON parent.oid = constraint_row.confrelid
        WHERE constraint_row.contype = 'f'
          AND child_namespace.nspname = current_schema()
          AND child.relname = ANY(%s)
          AND parent.relname = ANY(%s)
        ORDER BY child.relname, parent.relname
        """,
        (list(PRESERVED_TABLES), reset_tables),
    )
    return cursor.fetchall()


def count_rows(cursor, tables):
    counts = {}
    for table in tables:
        cursor.execute(sql.SQL("SELECT COUNT(*) FROM {}").format(sql.Identifier(table)))
        counts[table] = cursor.fetchone()[0]
    return counts


def truncate_tables(cursor, tables):
    if not tables:
        return
    identifiers = sql.SQL(", ").join(sql.Identifier(table) for table in tables)
    cursor.execute(sql.SQL("TRUNCATE TABLE {} RESTART IDENTITY").format(identifiers))


def clear_uploads(upload_root=UPLOAD_ROOT):
    if not upload_root.exists():
        upload_root.mkdir(parents=True, exist_ok=True)
        return 0

    removed = 0
    for entry in upload_root.iterdir():
        if entry.is_dir() and not entry.is_symlink():
            shutil.rmtree(entry)
        else:
            entry.unlink()
        removed += 1
    return removed


def reset_checkpoint():
    checkpoint = ROOT / "state" / "checkpoint.json"
    checkpoint.parent.mkdir(parents=True, exist_ok=True)
    checkpoint.write_text(
        json.dumps({"completedModels": []}, indent=2) + "\n",
        encoding="utf-8",
    )


def main():
    args = build_parser().parse_args()
    host, database = database_target()
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            tables = list_reset_tables(cursor)
            dependencies = protected_dependencies(cursor, tables)
            if dependencies:
                links = ", ".join(f"{child} -> {parent}" for child, parent in dependencies)
                raise RuntimeError(
                    "Reset refused because a preserved table depends on reset data: " + links
                )
            counts = count_rows(cursor, tables)
        connection.rollback()

        total_rows = sum(counts.values())
        print(f"Local database: {database} ({host})")
        print(f"Tables to reset: {len(tables)}")
        print(f"Rows to delete: {total_rows}")
        print("Preserving: admin_users, roles, permissions, _prisma_migrations")
        print(f"Uploads to clear: {UPLOAD_ROOT}")

        if not args.yes and input("Type RESET to continue: ").strip() != "RESET":
            print("Reset cancelled")
            return

        with connection.cursor() as cursor:
            truncate_tables(cursor, tables)
        connection.commit()

        removed_entries = clear_uploads()
        reset_checkpoint()
        print(
            f"Reset complete: {total_rows} rows removed, "
            f"{removed_entries} upload entries removed, checkpoint cleared"
        )
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


if __name__ == "__main__":
    main()
