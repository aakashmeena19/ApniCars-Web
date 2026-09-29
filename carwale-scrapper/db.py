import os
from urllib.parse import parse_qs, urlencode, urlsplit, urlunsplit

import psycopg2
from dotenv import load_dotenv
from psycopg2 import sql

from utils import BACKEND_ROOT


def get_connection():
    load_dotenv(BACKEND_ROOT / ".env")
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is missing from backend/.env")

    parts = urlsplit(database_url)
    query = parse_qs(parts.query)
    schema = query.pop("schema", ["public"])[0]
    clean_query = urlencode(query, doseq=True)
    clean_url = urlunsplit((parts.scheme, parts.netloc, parts.path, clean_query, parts.fragment))
    connection = psycopg2.connect(clean_url)
    connection.autocommit = False
    with connection.cursor() as cursor:
        cursor.execute(sql.SQL("SET search_path TO {}").format(sql.Identifier(schema)))
    connection.commit()
    return connection
