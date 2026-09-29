import os
import shutil
import subprocess
import time
from pathlib import Path


def find_adb():
    configured = os.getenv("ADB_PATH")
    candidates = [
        configured,
        shutil.which("adb"),
        str(Path(os.getenv("LOCALAPPDATA", "")) / "Android" / "Sdk" / "platform-tools" / "adb.exe"),
    ]
    for candidate in candidates:
        if candidate and Path(candidate).is_file():
            return candidate
    return None


class AdbIpRotator:
    def __init__(self, logger=None, runner=subprocess.run, sleep=time.sleep, clock=time.monotonic):
        self.logger = logger
        self.runner = runner
        self.sleep = sleep
        self.clock = clock
        self.adb_path = find_adb()
        self.airplane_seconds = int(os.getenv("CARWALE_ADB_AIRPLANE_SECONDS", "4"))
        self.network_wait_seconds = int(os.getenv("CARWALE_ADB_NETWORK_WAIT_SECONDS", "15"))
        self.cooldown_seconds = int(os.getenv("CARWALE_ADB_ROTATION_COOLDOWN_SECONDS", "60"))
        self.max_rotations = int(os.getenv("CARWALE_ADB_MAX_ROTATIONS", "20"))
        self.rotation_count = 0
        self.last_rotation_at = None
        self._availability_logged = False

    def _log(self, level, message, **data):
        if self.logger:
            self.logger.write(level, message, **data)

    def _run(self, serial, *arguments, timeout=15):
        if not self.adb_path:
            return False, "adb executable not found"
        command = [self.adb_path]
        if serial:
            command.extend(["-s", serial])
        command.extend(arguments)
        try:
            result = self.runner(
                command,
                capture_output=True,
                text=True,
                timeout=timeout,
                check=False,
            )
        except (OSError, subprocess.SubprocessError) as error:
            return False, str(error)

        output = f"{result.stdout or ''}\n{result.stderr or ''}".strip()
        denied = "permission denial" in output.lower() or "securityexception" in output.lower()
        return result.returncode == 0 and not denied, output

    def detect_device(self):
        if not self.adb_path:
            if not self._availability_logged:
                self._log("info", "ADB IP rotation unavailable: adb is not in PATH")
                self._availability_logged = True
            return None

        success, output = self._run(None, "devices")
        if not success:
            self._log("warn", "ADB device check failed", error=output)
            return None

        devices = []
        for line in output.splitlines()[1:]:
            parts = line.strip().split()
            if len(parts) >= 2 and parts[1] == "device":
                devices.append(parts[0])

        if len(devices) != 1:
            if not self._availability_logged:
                detail = "no authorized device" if not devices else "multiple authorized devices"
                self._log("info", f"ADB IP rotation unavailable: {detail}")
                self._availability_logged = True
            return None

        if not self._availability_logged:
            self._log("info", "ADB IP rotation ready")
            self._availability_logged = True
        return devices[0]

    def _set_airplane_mode(self, serial, enabled):
        state = "enable" if enabled else "disable"
        success, output = self._run(serial, "shell", "cmd", "connectivity", "airplane-mode", state)
        if success:
            return True

        numeric_state = "1" if enabled else "0"
        setting_ok, setting_output = self._run(
            serial,
            "shell",
            "settings",
            "put",
            "global",
            "airplane_mode_on",
            numeric_state,
        )
        broadcast_ok, broadcast_output = self._run(
            serial,
            "shell",
            "am",
            "broadcast",
            "-a",
            "android.intent.action.AIRPLANE_MODE",
            "--ez",
            "state",
            "true" if enabled else "false",
        )
        if setting_ok and broadcast_ok:
            return True

        error = broadcast_output or setting_output or output
        self._log("warn", f"ADB could not {state} airplane mode", error=error)
        return False

    def rotate(self):
        if self.rotation_count >= self.max_rotations:
            self._log("warn", "ADB rotation limit reached", limit=self.max_rotations)
            return False

        if self.last_rotation_at is not None:
            elapsed = self.clock() - self.last_rotation_at
            if elapsed < self.cooldown_seconds:
                self._log(
                    "info",
                    "ADB rotation skipped during cooldown",
                    retryAfterSeconds=round(self.cooldown_seconds - elapsed),
                )
                return False

        serial = self.detect_device()
        if not serial:
            return False

        self._log("warn", "Repeated CarWale block detected; cycling phone airplane mode")
        enabled = self._set_airplane_mode(serial, True)
        if not enabled:
            return False

        disabled = False
        try:
            self.sleep(self.airplane_seconds)
        finally:
            disabled = self._set_airplane_mode(serial, False)

        if not disabled:
            self._log("error", "Airplane mode was enabled but could not be disabled automatically")
            return False

        self.rotation_count += 1
        self.last_rotation_at = self.clock()
        self._log(
            "info",
            "Airplane mode cycle complete; waiting for phone network",
            rotation=self.rotation_count,
        )
        self.sleep(self.network_wait_seconds)
        return True
