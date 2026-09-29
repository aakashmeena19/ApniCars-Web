import subprocess
import sys
import unittest
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from adb_ip_rotator import AdbIpRotator  # noqa: E402


class FakeRunner:
    def __init__(self):
        self.commands = []

    def __call__(self, command, **_kwargs):
        self.commands.append(command)
        if command[-1] == "devices":
            output = "List of devices attached\nphone-1\tdevice\n"
        else:
            output = ""
        return subprocess.CompletedProcess(command, 0, stdout=output, stderr="")


class AdbIpRotatorTests(unittest.TestCase):
    def test_rotation_cycles_airplane_mode_on_and_off(self):
        runner = FakeRunner()
        sleeps = []
        rotator = AdbIpRotator(runner=runner, sleep=sleeps.append, clock=lambda: 100)
        rotator.adb_path = "adb"

        self.assertTrue(rotator.rotate())

        self.assertTrue(any(command[-1] == "enable" for command in runner.commands))
        self.assertTrue(any(command[-1] == "disable" for command in runner.commands))
        self.assertEqual(sleeps, [rotator.airplane_seconds, rotator.network_wait_seconds])
        self.assertEqual(rotator.rotation_count, 1)

    def test_multiple_devices_are_rejected(self):
        def runner(command, **_kwargs):
            output = "List of devices attached\nphone-1\tdevice\nphone-2\tdevice\n"
            return subprocess.CompletedProcess(command, 0, stdout=output, stderr="")

        rotator = AdbIpRotator(runner=runner)
        rotator.adb_path = "adb"

        self.assertIsNone(rotator.detect_device())


if __name__ == "__main__":
    unittest.main()
