import os
import time

import requests

from adb_ip_rotator import AdbIpRotator
from utils import sleep_ms


class HttpStatusError(RuntimeError):
    def __init__(self, url, status_code):
        super().__init__(f"HTTP {status_code} for {url}")
        self.url = url
        self.status_code = status_code


class CarWaleHttpClient:
    def __init__(self, logger=None, enable_adb_rotation=True, rotator=None):
        self.logger = logger
        self.session = self._new_session()
        self.rotator = rotator or (AdbIpRotator(logger) if enable_adb_rotation else None)
        self.block_threshold = int(os.getenv("CARWALE_BLOCK_THRESHOLD", "2"))
        self.max_rotations_per_request = int(os.getenv("CARWALE_MAX_ROTATIONS_PER_REQUEST", "2"))
        self._consecutive_blocks = 0
        self.page_delay_ms = int(os.getenv("CARWALE_PAGE_DELAY_MS", "1200"))
        self.image_delay_ms = int(os.getenv("CARWALE_IMAGE_DELAY_MS", "100"))
        self.timeout_seconds = int(os.getenv("CARWALE_HTTP_TIMEOUT_SECONDS", "30"))
        self._last_page_request = 0.0
        self._last_image_request = 0.0

    @staticmethod
    def _new_session():
        session = requests.Session()
        session.headers.update(
            {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
                "Accept-Language": "en-IN,en;q=0.9",
                "Referer": "https://www.carwale.com/",
            }
        )
        return session

    def _reset_session(self):
        self.session.close()
        self.session = self._new_session()

    def initialize_rotation(self):
        if self.rotator:
            self.rotator.detect_device()

    def close(self):
        self.session.close()

    def _request_headers(self, image):
        if not image:
            return None
        return {"Accept": "image/avif,image/webp,image/png,image/jpeg,*/*;q=0.8"}

    def _try_rotate(self, attempt, attempts, rotations):
        if (
            not self.rotator
            or attempt >= attempts
            or rotations >= self.max_rotations_per_request
            or self._consecutive_blocks < self.block_threshold
        ):
            return False
        if not self.rotator.rotate():
            return False
        self._reset_session()
        self._consecutive_blocks = 0
        return True

    def _log(self, level, message, **data):
        if self.logger:
            self.logger.write(level, message, **data)

    def _record_status(self, status_code):
        if status_code in {403, 429}:
            self._consecutive_blocks += 1
        else:
            self._consecutive_blocks = 0

    def _backoff(self, attempt):
        time.sleep(min(30, 1.5 * (2 ** (attempt - 1))))

    def _request(self, url, image, stream):
        return self.session.get(
            url,
            timeout=self.timeout_seconds,
            allow_redirects=True,
            stream=stream,
            headers=self._request_headers(image),
        )

    def _handle_response(self, response, url):
        if response.ok:
            self._consecutive_blocks = 0
            return response
        status_code = response.status_code
        response.close()
        self._record_status(status_code)
        raise HttpStatusError(url, status_code)

    def get(self, url, image=False, attempts=5, stream=False):
        retry_statuses = {403, 408, 429, 500, 502, 503, 504}
        last_error = None
        rotations = 0
        for attempt in range(1, attempts + 1):
            self._throttle(image)
            try:
                response = self._handle_response(self._request(url, image, stream), url)
                return response
            except HttpStatusError as error:
                if error.status_code == 404:
                    raise
                if error.status_code not in retry_statuses:
                    raise
                last_error = error
                if error.status_code in {403, 429} and self._try_rotate(attempt, attempts, rotations):
                    rotations += 1
                    self._log("info", "Retrying blocked URL after ADB network cycle", url=url)
                    continue
            except requests.RequestException as error:
                last_error = error
            if attempt < attempts:
                self._backoff(attempt)
        raise last_error or RuntimeError(f"Request failed for {url}")

    def text(self, url):
        response = self.get(url)
        try:
            return response.text
        finally:
            response.close()

    def _throttle(self, image):
        delay = self.image_delay_ms if image else self.page_delay_ms
        last = self._last_image_request if image else self._last_page_request
        elapsed_ms = (time.monotonic() - last) * 1000
        sleep_ms(max(0, delay - elapsed_ms))
        if image:
            self._last_image_request = time.monotonic()
        else:
            self._last_page_request = time.monotonic()

