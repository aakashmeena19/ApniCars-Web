import sys
import unittest
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from parsers import (  # noqa: E402
    build_specs,
    cylinder_count,
    fuel_label,
    regenerative_braking,
    transmission_label,
    user_reported_mileage,
    variant_dimensions,
    warranty_numbers,
)
from utils import extract_assigned_json, high_resolution_image_url, parse_date, slugify  # noqa: E402


class ParserTests(unittest.TestCase):
    def test_extract_assigned_json(self):
        html = '<script>window.__INITIAL_STATE__ = {"text":"a } value","nested":{"ok":true}};</script>'
        self.assertEqual(
            extract_assigned_json(html, "__INITIAL_STATE__"),
            {"text": "a } value", "nested": {"ok": True}},
        )

    def test_normalisers(self):
        self.assertEqual(slugify("Maruti Suzuki & Co."), "maruti-suzuki-and-co")
        self.assertEqual(parse_date("04/24/2023 00:00:00").isoformat(), "2023-04-24")
        self.assertTrue(high_resolution_image_url("https://imgd.aeplcdn.com/664x374/n/car.jpg?q=80").endswith("/1280x720/n/car.jpg"))
        self.assertTrue(high_resolution_image_url("https://imgd.aeplcdn.com/0X0/n/car.jpg?q=80").endswith("/1280x720/n/car.jpg"))
        self.assertTrue(high_resolution_image_url("/n/car.jpg?q=80").endswith("/1280x720/n/car.jpg"))

    def test_version_specs_override_trim_specs(self):
        trim = {1: [{"category": "Engine", "itemName": "Fuel Type", "value": "Petrol"}]}
        version = {
            "trimId": 1,
            "specsSummary": [
                {"itemName": "Fuel Type", "value": "CNG", "unitType": ""},
                {"itemName": "Transmission Type", "value": "Manual", "unitType": ""},
            ],
            "featureSpecs": [],
        }
        specs = build_specs(version, trim)
        self.assertEqual(fuel_label(specs), "CNG")
        self.assertEqual(transmission_label(specs), "Manual")

    def test_cylinder_count_uses_engine_text_without_reading_displacement(self):
        specs = [{"name": "Engine", "value": "1197 cc, 4 Cylinders Inline", "category": "Engine"}]
        self.assertEqual(cylinder_count(specs), 4)

    def test_combined_chassis_specs_are_split(self):
        specs = [
            {"name": "Length *Width *Height", "value": "3995 mm * 1790 mm * 1685 mm"},
            {"name": "Brakes", "value": "Ventilated Disc (Front), Drum (Rear)"},
            {"name": "Steering", "value": "Power-assisted (Electric) steering"},
        ]
        dimensions = variant_dimensions(specs)
        self.assertEqual(
            (dimensions["length_mm"], dimensions["width_mm"], dimensions["height_mm"]),
            (3995, 1790, 1685),
        )
        self.assertEqual(dimensions["front_brake_type"], "Ventilated Disc")
        self.assertEqual(dimensions["rear_brake_type"], "Drum")
        self.assertEqual(dimensions["steering_type"], "Power-assisted (Electric) steering")

    def test_mileage_warranty_and_regeneration_parsers(self):
        specs = [
            {"name": "Mileage", "value": "ARAI: 14.2 kmpl | User Reported: 12 kmpl"},
            {"name": "Regenerative Braking", "value": "3 Level Regenerative Braking"},
        ]
        self.assertEqual(user_reported_mileage(specs), 12.0)
        self.assertEqual(warranty_numbers("8 Years / 160,000 kms"), (8, 160000))
        self.assertEqual(regenerative_braking(specs), (True, 3))


if __name__ == "__main__":
    unittest.main()
