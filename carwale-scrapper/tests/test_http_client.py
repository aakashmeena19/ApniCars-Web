import sys
import unittest
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from http_client import CarWaleHttpClient, HttpStatusError  # noqa: E402


class FakeResponse:
    def __init__(self, status_code):
        self.status_code = status_code
        self.ok = 200 <= status_code < 400
        self.closed = False

    def close(self):
        self.closed = True


class FakeSession:
    def __init__(self, statuses):
        self.responses = [FakeResponse(status) for status in statuses]

    def get(self, *_args, **_kwargs):
        return self.responses.pop(0)

    def close(self):
        pass


class FakeRotator:
    def __init__(self):
        self.calls = 0

    def rotate(self):
        self.calls += 1
        return True

    def detect_device(self):
        return "device"


class HttpClientTests(unittest.TestCase):
    def make_client(self, statuses, rotator):
        client = CarWaleHttpClient(rotator=rotator)
        client.session.close()
        client.session = FakeSession(statuses)
        client._throttle = lambda _image: None
        client._backoff = lambda _attempt: None
        client._reset_session = lambda: None
        return client

    def test_repeated_blocks_rotate_then_retry(self):
        rotator = FakeRotator()
        client = self.make_client([403, 429, 200], rotator)

        response = client.get("https://www.carwale.com/test")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(rotator.calls, 1)

    def test_not_found_is_not_retried_or_rotated(self):
        rotator = FakeRotator()
        client = self.make_client([404], rotator)

        with self.assertRaises(HttpStatusError) as context:
            client.get("https://www.carwale.com/missing")

        self.assertEqual(context.exception.status_code, 404)
        self.assertEqual(rotator.calls, 0)


if __name__ == "__main__":
    unittest.main()
