import os
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import reset_data  # noqa: E402


class ResetDataTests(unittest.TestCase):
    def test_database_target_accepts_localhost(self):
        with patch.dict(
            os.environ,
            {"DATABASE_URL": "postgresql://user:password@localhost:5432/apnicars"},
            clear=False,
        ):
            self.assertEqual(reset_data.database_target(), ("localhost", "apnicars"))

    def test_database_target_rejects_remote_host(self):
        with patch.dict(
            os.environ,
            {"DATABASE_URL": "postgresql://user:password@db.example.com:5432/apnicars"},
            clear=False,
        ):
            with self.assertRaisesRegex(RuntimeError, "is not local"):
                reset_data.database_target()

    def test_clear_uploads_keeps_root_and_removes_contents(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / "uploads"
            nested = root / "car-images"
            nested.mkdir(parents=True)
            (nested / "car.avif").write_bytes(b"image")
            (root / "loose.avif").write_bytes(b"image")

            removed = reset_data.clear_uploads(root)

            self.assertEqual(removed, 2)
            self.assertTrue(root.is_dir())
            self.assertEqual(list(root.iterdir()), [])


if __name__ == "__main__":
    unittest.main()
