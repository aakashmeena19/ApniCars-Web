import re

from utils import clean_text, integer_from, number_from


FUEL_CODES = {"petrol": 1, "diesel": 2, "cng": 3, "lpg": 4, "hybrid": 5}
FEATURE_NAME_ALIASES = {
    "turbocharger/ supercharger": "Turbocharger / Supercharger",
    "tyre pressure monitoring system (tpms)": "Tyre Pressure Monitoring System",
}


def build_specs(version, trim_features):
    rows = [*trim_features.get(version.get("trimId"), [])]
    rows.extend({"category": "Specifications", **item} for item in version.get("specsSummary", []))
    rows.extend({"category": "Features", **item} for item in version.get("featureSpecs", []))
    by_name = {}
    for item in rows:
        name = clean_text(item.get("itemName"))
        name = FEATURE_NAME_ALIASES.get(name.lower(), name)
        raw_value = clean_text(item.get("value"))
        if not name or not raw_value:
            continue
        unit = clean_text(item.get("unitType"))
        value = raw_value
        if unit and unit.lower() not in raw_value.lower():
            value = f"{raw_value} {unit}"
        by_name[name.lower()] = {
            "name": name,
            "value": value,
            "category": clean_text(item.get("category")) or "General",
        }
    return list(by_name.values())


def spec_value(specs, *names):
    wanted = {name.lower() for name in names}
    for item in specs:
        if item["name"].lower() in wanted:
            return item["value"]
    return ""


def fuel_label(specs):
    return clean_text(spec_value(specs, "Fuel Type"))


def transmission_label(specs):
    return clean_text(spec_value(specs, "Transmission Type", "Transmission")) or "Not specified"


def parse_output_rpm(value):
    numbers = [float(item) for item in re.findall(r"\d+(?:\.\d+)?", str(value or "").replace(",", ""))]
    output = round(numbers[0]) if numbers else None
    min_rpm = round(numbers[1]) if len(numbers) > 1 else None
    max_rpm = round(numbers[2]) if len(numbers) > 2 else min_rpm
    return output, min_rpm, max_rpm


def power_ps(specs):
    value = number_from(spec_value(specs, "Max Engine Power", "Max Power"))
    if value is None:
        value, _, _ = parse_output_rpm(spec_value(specs, "Max Power (bhp@rpm)"))
    return round(value * 1.01387) if value is not None else None


def normalise_fuel_key(label):
    lowered = clean_text(label).lower()
    if "electric" in lowered:
        return "electric"
    for key in FUEL_CODES:
        if key in lowered:
            return key
    return None


def cylinder_count(specs):
    direct = integer_from(spec_value(specs, "No of Cylinders"))
    if direct is not None:
        return direct
    match = re.search(r"(\d+)\s*cylinders?", spec_value(specs, "Engine"), flags=re.IGNORECASE)
    return int(match.group(1)) if match else None


def variant_dimensions(specs):
    combined = [
        round(float(value))
        for value in re.findall(r"\d+(?:\.\d+)?", spec_value(specs, "Length *Width *Height"))
    ]
    brakes = spec_value(specs, "Brakes")
    front_brake = spec_value(specs, "Front Brake Type")
    rear_brake = spec_value(specs, "Rear Brake Type")
    if brakes:
        front_match = re.search(r"([^,]+?)\s*\(Front(?:\s*&\s*Rear)?\)", brakes, flags=re.IGNORECASE)
        rear_match = re.search(r"([^,]+?)\s*\(Rear\)", brakes, flags=re.IGNORECASE)
        if front_match:
            front_brake = clean_text(front_match.group(1))
            if "front & rear" in front_match.group(0).lower():
                rear_brake = front_brake
        if rear_match:
            rear_brake = clean_text(rear_match.group(1))
    return {
        "length_mm": integer_from(spec_value(specs, "Length")) or (combined[0] if len(combined) > 0 else None),
        "width_mm": integer_from(spec_value(specs, "Width")) or (combined[1] if len(combined) > 1 else None),
        "height_mm": integer_from(spec_value(specs, "Height")) or (combined[2] if len(combined) > 2 else None),
        "wheel_base_mm": integer_from(spec_value(specs, "Wheelbase")),
        "ground_clearance_mm": integer_from(spec_value(specs, "Ground Clearance (unladen)", "Ground Clearance")),
        "boot_space_litres": integer_from(spec_value(specs, "Bootspace", "Boot Space")),
        "front_suspension": clean_text(spec_value(specs, "Front Suspension"))[:100] or None,
        "rear_suspension": clean_text(spec_value(specs, "Rear Suspension"))[:100] or None,
        "steering_type": clean_text(spec_value(specs, "Steering Type", "Steering"))[:50] or None,
        "front_brake_type": clean_text(front_brake)[:50] or None,
        "rear_brake_type": clean_text(rear_brake)[:50] or None,
    }


def user_reported_mileage(specs):
    direct = number_from(spec_value(specs, "Mileage - Owner Reported", "Mileage - User Reported"))
    if direct is not None:
        return direct
    match = re.search(r"User Reported:\s*([\d.]+)", spec_value(specs, "Mileage"), flags=re.IGNORECASE)
    return float(match.group(1)) if match else None


def warranty_numbers(value):
    text = clean_text(value)
    years_match = re.search(r"(\d+)\s*Years?", text, flags=re.IGNORECASE)
    distance_match = re.search(r"([\d,]+)\s*kms?", text, flags=re.IGNORECASE)
    return (
        int(years_match.group(1)) if years_match else None,
        int(distance_match.group(1).replace(",", "")) if distance_match else None,
    )


def regenerative_braking(specs):
    value = clean_text(spec_value(specs, "Regenerative Braking"))
    if not value or value.lower() in {"no", "not available", "not applicable"}:
        return False, None
    levels = integer_from(spec_value(specs, "Regenerative Braking Levels"))
    if levels is None:
        match = re.search(r"(\d+)\s*Levels?", value, flags=re.IGNORECASE)
        levels = int(match.group(1)) if match else None
    return True, levels
