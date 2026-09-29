import io
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import pillow_avif  # noqa: F401
from PIL import Image


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import images  # noqa: E402


class FakeResponse:
    headers = {"content-type": "image/png"}

    def __init__(self, data):
        self.data = data

    def iter_content(self, _chunk_size):
        yield self.data

    def close(self):
        pass


class FakeHttp:
    def __init__(self, data):
        self.data = data

    def get(self, *_args, **_kwargs):
        return FakeResponse(self.data)


class FakeLogger:
    def write(self, *_args, **_kwargs):
        pass


class ImageStoreTests(unittest.TestCase):
    def test_transparent_image_keeps_alpha_when_saved_as_avif(self):
        source = Image.new("RGBA", (4, 4), (255, 0, 0, 0))
        source.putpixel((0, 0), (255, 0, 0, 255))
        buffer = io.BytesIO()
        source.save(buffer, format="PNG")

        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            with patch.object(images, "UPLOAD_ROOT", root):
                store = images.ImageStore(FakeHttp(buffer.getvalue()), FakeLogger())
                public_path = store.save_remote(
                    "https://imgd.aeplcdn.com/0X0/n/transparent.png",
                    "car-images",
                    "transparent-test",
                )

            saved_path = root / public_path.removeprefix("/uploads/")
            with Image.open(saved_path) as saved:
                self.assertEqual(saved.mode, "RGBA")
                self.assertEqual(saved.getchannel("A").getextrema(), (0, 255))


if __name__ == "__main__":
    unittest.main()
