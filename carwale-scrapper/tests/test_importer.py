import sys
import unittest
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from importer import CatalogImporter  # noqa: E402


class FakeCursor:
    rowcount = 1

    def __init__(self):
        self.last_query = ""

    def execute(self, query, params=None):
        self.last_query = query
        if params is not None:
            self.assert_parameter_count(query, params)

    @staticmethod
    def assert_parameter_count(query, params):
        expected = query.count("%s")
        actual = len(params)
        if expected != actual:
            raise AssertionError(f"SQL expects {expected} parameters but received {actual}")

    def fetchone(self):
        return (1,)


class FakeLogger:
    def write(self, *_args, **_kwargs):
        pass


def spec(name, value):
    return {"name": name, "value": value, "category": "Specifications"}


class ImporterTests(unittest.TestCase):
    def setUp(self):
        self.importer = CatalogImporter(None, {}, None, None, FakeLogger())
        self.importer._attribute_option_id = lambda *_args: 1

    def test_ice_powertrain_sql_matches_values(self):
        specs = [
            spec("Fuel Type", "Petrol"),
            spec("Engine Type", "Turbo Petrol"),
            spec("Displacement", "1197 cc"),
            spec("Engine", "1197 cc, 4 Cylinders Inline"),
            spec("Max Engine Power", "118 bhp"),
            spec("Max Engine Torque", "172 Nm"),
            spec("Transmission", "Automatic (DCT) - 7 Gears"),
            spec("Drivetrain", "FWD"),
        ]
        self.importer._save_powertrain(FakeCursor(), 1, specs, "Petrol")

    def test_electric_powertrain_sql_matches_values(self):
        specs = [
            spec("Fuel Type", "Electric"),
            spec("Battery Capacity", "45 kWh"),
            spec("Max Engine Power", "143 bhp"),
            spec("Max Engine Torque", "215 Nm"),
            spec("Driving Range", "489 km"),
            spec("Charging Options", "7.2 kW AC Wall Box"),
            spec("Battery Warranty", "8 Years / 160,000 kms"),
            spec("Regenerative Braking", "3 Level Regenerative Braking"),
            spec("Drivetrain", "FWD"),
        ]
        self.importer._save_powertrain(FakeCursor(), 1, specs, "Electric")

    def test_variant_sql_matches_values(self):
        cursor = FakeCursor()
        self.importer._save_powertrain = lambda *_args: None
        self.importer._save_features = lambda *_args: None
        item = {
            "version": {"versionName": "Test Variant"},
            "price": 1000000,
            "transmission": "Manual",
            "fuel": "Petrol",
            "specs": [
                spec("Length *Width *Height", "4000 mm * 1800 mm * 1600 mm"),
                spec("Vehicle Warranty", "3 Years / 100,000 kms"),
            ],
        }
        self.importer._save_variant(cursor, 1, item, 5)


if __name__ == "__main__":
    unittest.main()
