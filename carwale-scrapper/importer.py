from parsers import (
    FUEL_CODES,
    build_specs,
    cylinder_count,
    fuel_label,
    normalise_fuel_key,
    parse_output_rpm,
    power_ps,
    regenerative_braking,
    spec_value,
    transmission_label,
    user_reported_mileage,
    variant_dimensions,
    warranty_numbers,
)
from utils import clean_text, integer_from, number_from, slugify


class CatalogImporter:
    def __init__(self, connection, body_types, fuel_filter, transmission_filter, logger):
        self.connection = connection
        self.body_types = body_types
        self.fuel_filter = fuel_filter
        self.transmission_filter = transmission_filter
        self.logger = logger

    @staticmethod
    def _matches(selection, value):
        if not selection:
            return True
        lowered = clean_text(value).lower()
        return any(item in lowered for item in selection)

    @staticmethod
    def _returning_id(cursor):
        return cursor.fetchone()[0]

    def import_brand(self, brand, logo_url):
        with self.connection.cursor() as cursor:
            cursor.execute("SELECT id FROM countries WHERE code = %s ORDER BY id LIMIT 1", ("IN",))
            row = cursor.fetchone()
            if row:
                country_id = row[0]
            else:
                cursor.execute(
                    """
                    INSERT INTO countries
                        (name, code, currency, currency_symbol, currency_code)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id
                    """,
                    ("India", "IN", "Indian Rupee", "Rs.", "INR"),
                )
                country_id = self._returning_id(cursor)
            cursor.execute(
                """
                INSERT INTO brands (name, slug, logo_url, country_origin_id, is_active)
                VALUES (%s, %s, %s, %s, TRUE)
                ON CONFLICT (slug) DO UPDATE SET
                    name = EXCLUDED.name,
                    logo_url = EXCLUDED.logo_url,
                    country_origin_id = EXCLUDED.country_origin_id,
                    is_active = TRUE
                RETURNING id
                """,
                (brand["name"], brand["slug"], logo_url, country_id),
            )
            brand_id = self._returning_id(cursor)
        self.connection.commit()
        return brand_id

    def _body_type_id(self, cursor, source_id):
        name = self.body_types.get(source_id)
        if not name:
            return None
        slug = slugify(name, 50)
        cursor.execute(
            """
            INSERT INTO body_types (name, slug)
            VALUES (%s, %s)
            ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
            RETURNING id
            """,
            (name[:50], slug),
        )
        return self._returning_id(cursor)

    @staticmethod
    def _attribute_option_id(cursor, category, name):
        name = clean_text(name)[:50] or "Not specified"
        slug = slugify(name, 50)
        cursor.execute(
            """
            INSERT INTO attribute_options (category, name, slug)
            VALUES (%s, %s, %s)
            ON CONFLICT (category, slug) DO UPDATE SET name = EXCLUDED.name
            RETURNING id
            """,
            (category, name, slug),
        )
        return cursor.fetchone()[0]

    @staticmethod
    def _safe_model_slug(cursor, brand_id, requested_slug, brand_slug):
        cursor.execute("SELECT brand_id FROM car_models WHERE slug = %s", (requested_slug,))
        row = cursor.fetchone()
        if not row or row[0] == brand_id:
            return requested_slug
        return slugify(f"{brand_slug}-{requested_slug}", 100)

    def _eligible_versions(self, bundle):
        output = []
        for version in bundle["versions"]:
            specs = build_specs(version, bundle["trim_features"])
            fuel = fuel_label(specs)
            transmission = transmission_label(specs)
            price_overview = version.get("priceOverview", {})
            price = int(price_overview.get("price") or 0)
            price_label = clean_text(price_overview.get("priceLabel")).lower()
            if price <= 0 or "ex-showroom" not in price_label:
                continue
            if not self._matches(self.fuel_filter, fuel):
                continue
            if not self._matches(self.transmission_filter, transmission):
                continue
            output.append(
                {
                    "version": version,
                    "specs": specs,
                    "fuel": fuel,
                    "transmission": transmission,
                    "price": price,
                }
            )
        return output

    def import_model(self, brand_id, brand, model, bundle, media):
        eligible = self._eligible_versions(bundle)
        prices = [item["price"] for item in eligible]
        try:
            with self.connection.cursor() as cursor:
                body_type_id = self._body_type_id(cursor, model.get("body_type_source_id"))
                model_slug = self._safe_model_slug(cursor, brand_id, model["slug"], brand["slug"])
                cursor.execute(
                    """
                    INSERT INTO car_models
                        (brand_id, name, slug, body_type_id, launch_status,
                         expected_launch_date, price_min, price_max, cover_image_url)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (slug) DO UPDATE SET
                        brand_id = EXCLUDED.brand_id,
                        name = EXCLUDED.name,
                        body_type_id = EXCLUDED.body_type_id,
                        launch_status = EXCLUDED.launch_status,
                        expected_launch_date = EXCLUDED.expected_launch_date,
                        price_min = EXCLUDED.price_min,
                        price_max = EXCLUDED.price_max,
                        cover_image_url = EXCLUDED.cover_image_url
                    RETURNING id
                    """,
                    (
                        brand_id,
                        model["name"][:100],
                        model_slug,
                        body_type_id,
                        model["status"],
                        model.get("expected_launch_date"),
                        min(prices) if prices else None,
                        max(prices) if prices else None,
                        media.get("cover_image_url"),
                    ),
                )
                model_id = self._returning_id(cursor)
                self.logger.write(
                    "info",
                    f"Writing database records: {model['name']} | {len(media['colors'])} colors, "
                    f"{len(media['images'])} images, {len(eligible)} eligible variants",
                )
                color_ids = self._save_colors(cursor, model_id, media["colors"])
                self._save_images(cursor, model_id, media["images"], color_ids)

                variant_count = 0
                for position, item in enumerate(eligible, start=1):
                    seating = integer_from(spec_value(item["specs"], "Seating Capacity"))
                    if not seating:
                        self.logger.write(
                            "warn",
                            f"Variant skipped because seating capacity is missing: {model['name']} {item['version'].get('versionName')}",
                        )
                    else:
                        self._save_variant(cursor, model_id, item, seating)
                        variant_count += 1
                    self.logger.progress(
                        f"Database variants {position}/{len(eligible)}: {model['name']} | saved {variant_count}",
                        position,
                        len(eligible),
                    )
                self.logger.finish_progress()
            self.connection.commit()
            return {
                "model_id": model_id,
                "variant_count": variant_count,
                "image_count": len(media["images"]),
            }
        except Exception:
            self.connection.rollback()
            raise

    def _save_colors(self, cursor, model_id, colors):
        color_ids = {}
        for position, color in enumerate(colors, start=1):
            color_name = clean_text(color.get("name"))[:50]
            if not color_name:
                continue
            cursor.execute(
                """
                INSERT INTO car_colors (model_id, color_name, image_url)
                VALUES (%s, %s, %s)
                ON CONFLICT (model_id, color_name) DO UPDATE SET image_url = EXCLUDED.image_url
                RETURNING id
                """,
                (model_id, color_name, color.get("local_image_url")),
            )
            color_id = cursor.fetchone()[0]
            color_ids[int(color.get("id") or 0)] = color_id
            hex_values = [value.strip() for value in str(color.get("hexCode") or "").split(",") if value.strip()]
            for sort_order, hex_value in enumerate(hex_values):
                normalized = f"#{hex_value.lstrip('#')[:6]}"
                cursor.execute(
                    "SELECT id FROM car_color_shades WHERE color_id = %s AND sort_order = %s LIMIT 1",
                    (color_id, sort_order),
                )
                row = cursor.fetchone()
                if row:
                    cursor.execute("UPDATE car_color_shades SET color_hex = %s WHERE id = %s", (normalized, row[0]))
                else:
                    cursor.execute(
                        "INSERT INTO car_color_shades (color_id, color_hex, sort_order) VALUES (%s, %s, %s)",
                        (color_id, normalized, sort_order),
                    )
            self.logger.progress(
                f"Database colors {position}/{len(colors)}",
                position,
                len(colors),
            )
        self.logger.finish_progress()
        return color_ids

    def _save_images(self, cursor, model_id, images, color_ids):
        for position, image in enumerate(images, start=1):
            cursor.execute(
                """
                INSERT INTO car_images
                    (model_id, color_id, image_url, is_primary, angle, category, caption, sort_order)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (model_id, image_url) DO UPDATE SET
                    color_id = EXCLUDED.color_id,
                    is_primary = EXCLUDED.is_primary,
                    angle = EXCLUDED.angle,
                    category = EXCLUDED.category,
                    caption = EXCLUDED.caption,
                    sort_order = EXCLUDED.sort_order
                """,
                (
                    model_id,
                    color_ids.get(image.get("source_color_id")),
                    image["image_url"],
                    image["is_primary"],
                    image.get("angle"),
                    image.get("category"),
                    image.get("caption"),
                    image.get("sort_order", 0),
                ),
            )
            self.logger.progress(
                f"Database images {position}/{len(images)}",
                position,
                len(images),
            )
        self.logger.finish_progress()

    def _save_variant(self, cursor, model_id, item, seating):
        version = item["version"]
        specs = item["specs"]
        transmission_id = self._attribute_option_id(cursor, "transmission", item["transmission"])
        dimensions = variant_dimensions(specs)
        values = (
            model_id,
            clean_text(version.get("versionName"))[:100],
            item["price"],
            seating,
            transmission_id,
            dimensions["length_mm"],
            dimensions["width_mm"],
            dimensions["height_mm"],
            dimensions["wheel_base_mm"],
            dimensions["ground_clearance_mm"],
            dimensions["boot_space_litres"],
            dimensions["front_suspension"],
            dimensions["rear_suspension"],
            dimensions["steering_type"],
            dimensions["front_brake_type"],
            dimensions["rear_brake_type"],
            clean_text(spec_value(specs, "Vehicle Warranty"))[:100] or None,
        )
        cursor.execute(
            """
            INSERT INTO car_variants
                (model_id, variant_name, price, seating_capacity, transmission_id,
                 length_mm, width_mm, height_mm, wheel_base_mm, ground_clearance_mm,
                 boot_space_litres, front_suspension, rear_suspension, steering_type,
                 front_brake_type, rear_brake_type, vehicle_warranty_raw)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (model_id, variant_name) DO UPDATE SET
                price = EXCLUDED.price,
                seating_capacity = EXCLUDED.seating_capacity,
                transmission_id = EXCLUDED.transmission_id,
                length_mm = EXCLUDED.length_mm,
                width_mm = EXCLUDED.width_mm,
                height_mm = EXCLUDED.height_mm,
                wheel_base_mm = EXCLUDED.wheel_base_mm,
                ground_clearance_mm = EXCLUDED.ground_clearance_mm,
                boot_space_litres = EXCLUDED.boot_space_litres,
                front_suspension = EXCLUDED.front_suspension,
                rear_suspension = EXCLUDED.rear_suspension,
                steering_type = EXCLUDED.steering_type,
                front_brake_type = EXCLUDED.front_brake_type,
                rear_brake_type = EXCLUDED.rear_brake_type,
                vehicle_warranty_raw = EXCLUDED.vehicle_warranty_raw
            RETURNING id
            """,
            values,
        )
        variant_id = cursor.fetchone()[0]
        self._save_powertrain(cursor, variant_id, specs, item["fuel"])
        self._save_features(cursor, variant_id, specs)

    def _save_powertrain(self, cursor, variant_id, specs, fuel):
        drivetrain = spec_value(specs, "Drivetrain") or "Not specified"
        drivetrain_id = self._attribute_option_id(cursor, "drivetrain", drivetrain)
        fuel_key = normalise_fuel_key(fuel)
        power = power_ps(specs)
        _, power_min_rpm, power_max_rpm = parse_output_rpm(spec_value(specs, "Max Power (bhp@rpm)"))
        torque, torque_min_rpm, torque_max_rpm = parse_output_rpm(spec_value(specs, "Max Torque (Nm@rpm)"))

        if fuel_key == "electric":
            charging_options = clean_text(spec_value(specs, "Charging Options"))
            battery_warranty = clean_text(spec_value(specs, "Battery Warranty"))
            battery_warranty_years, battery_warranty_km = warranty_numbers(battery_warranty)
            has_regen, regen_levels = regenerative_braking(specs)
            ac_output = number_from(spec_value(specs, "AC Charging Output"))
            dc_output = number_from(spec_value(specs, "DC Charging Output"))
            if ac_output is None and "ac" in charging_options.lower():
                ac_output = number_from(charging_options)
            if dc_output is None and "dc" in charging_options.lower():
                dc_output = number_from(charging_options)
            data = (
                integer_from(spec_value(specs, "No. of Motors", "Number of Motors")),
                clean_text(spec_value(specs, "Motor Type"))[:50] or None,
                number_from(spec_value(specs, "Battery Capacity")),
                clean_text(spec_value(specs, "Battery Chemistry"))[:30] or None,
                clean_text(spec_value(specs, "Thermal Management System"))[:50] or None,
                drivetrain_id,
                power,
                torque or integer_from(spec_value(specs, "Max Motor Torque", "Max Engine Torque")),
                integer_from(spec_value(specs, "Driving Range", "Range (ARAI)")),
                integer_from(spec_value(specs, "Range - User Reported")),
                integer_from(spec_value(specs, "Top Speed")),
                number_from(spec_value(specs, "Acceleration (0-100 kmph) Claimed", "Acceleration (0-100 kmph)")),
                ac_output,
                number_from(spec_value(specs, "Charging Time at 220V", "AC Charging Time")),
                dc_output,
                clean_text(spec_value(specs, "DC Fast Charging Time"))[:50] or None,
                battery_warranty_km,
                battery_warranty_years,
                battery_warranty[:100] or None,
                number_from(spec_value(specs, "Motor Power")),
                clean_text(spec_value(specs, "Charging Port"))[:30] or None,
                charging_options[:255] or None,
                has_regen,
                regen_levels,
                variant_id,
            )
            cursor.execute(
                """
                UPDATE car_powertrains_electric SET
                    num_motors=%s, motor_type=%s, battery_capacity=%s, battery_chemistry=%s,
                    thermal_management_system=%s, drivetrain_id=%s,
                    power_ps=%s, torque_nm=%s, claimed_range=%s, real_world_range=%s,
                    top_speed_kmph=%s, acceleration_0_100_sec=%s, ac_charging_output=%s,
                    ac_charging_time=%s, dc_charging_output=%s, dc_fast_charging_time=%s,
                    battery_warranty_km=%s, battery_warranty_years=%s, battery_warranty_raw=%s,
                    motor_power_kw=%s, charging_port=%s, charging_options_raw=%s,
                    regenerative_braking=%s, regenerative_braking_levels=%s, is_default=TRUE
                WHERE variant_id=%s AND is_deleted=FALSE
                """,
                data,
            )
            if cursor.rowcount == 0:
                cursor.execute(
                    """
                    INSERT INTO car_powertrains_electric
                        (num_motors, motor_type, battery_capacity, battery_chemistry,
                         thermal_management_system, drivetrain_id, power_ps,
                         torque_nm, claimed_range, real_world_range, top_speed_kmph,
                         acceleration_0_100_sec, ac_charging_output, ac_charging_time,
                         dc_charging_output, dc_fast_charging_time, battery_warranty_km,
                         battery_warranty_years, battery_warranty_raw, motor_power_kw,
                         charging_port, charging_options_raw, regenerative_braking,
                         regenerative_braking_levels, variant_id, is_default)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, TRUE)
                    """,
                    data,
                )
            return

        if fuel_key not in FUEL_CODES:
            return
        cc = integer_from(spec_value(specs, "Displacement", "Engine"))
        turbo_text = f"{spec_value(specs, 'Engine Type')} {spec_value(specs, 'Turbocharger / Supercharger', 'Turbocharger/ Supercharger')}"
        data = (
            FUEL_CODES[fuel_key],
            clean_text(spec_value(specs, "Engine Type"))[:100] or None,
            number_from(spec_value(specs, "Fuel Tank Capacity")),
            number_from(spec_value(specs, "CNG Fuel Tank Capacity", "CNG Tank Capacity")),
            integer_from(spec_value(specs, "Kerb Weight")),
            cc,
            cylinder_count(specs),
            integer_from(spec_value(specs, "No of Gears", "Transmission")),
            bool(__import__("re").search(r"4wd|4x4|awd", drivetrain, flags=__import__("re").IGNORECASE)),
            drivetrain_id,
            power,
            power_min_rpm,
            power_max_rpm,
            integer_from(spec_value(specs, "Max Engine Torque")) or torque,
            torque_min_rpm,
            torque_max_rpm,
            number_from(spec_value(specs, "Mileage (ARAI)", "Mileage")),
            user_reported_mileage(specs),
            integer_from(spec_value(specs, "Top Speed")),
            number_from(spec_value(specs, "Acceleration (0-100 kmph) Claimed", "Acceleration (0-100 kmph)")),
            clean_text(spec_value(specs, "Emission Standard"))[:30] or None,
            "turbo" in turbo_text.lower() or "supercharger" in turbo_text.lower(),
            variant_id,
        )
        cursor.execute(
            """
            UPDATE car_powertrains_ice SET
                fuel_type=%s, engine_type=%s, fuel_tank_capacity=%s,
                cng_tank_capacity=%s, kerb_weight=%s, displacement_cc=%s,
                cylinders=%s, num_gears=%s, is_four_by_four=%s,
                drivetrain_id=%s, power_ps=%s, power_min_rpm=%s, power_max_rpm=%s,
                torque_nm=%s, torque_min_rpm=%s, torque_max_rpm=%s, claimed_fe=%s,
                real_world_mileage=%s, top_speed_kmph=%s, acceleration_0_100_sec=%s,
                emission_norm_compliance=%s, turbo_charger=%s, is_default=TRUE
            WHERE variant_id=%s AND is_deleted=FALSE
            """,
            data,
        )
        if cursor.rowcount == 0:
            cursor.execute(
                """
                INSERT INTO car_powertrains_ice
                    (fuel_type, engine_type, fuel_tank_capacity, cng_tank_capacity,
                     kerb_weight, displacement_cc, cylinders, num_gears,
                     is_four_by_four, drivetrain_id, power_ps, power_min_rpm, power_max_rpm,
                     torque_nm, torque_min_rpm, torque_max_rpm, claimed_fe,
                     real_world_mileage, top_speed_kmph, acceleration_0_100_sec,
                     emission_norm_compliance, turbo_charger, variant_id, is_default)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, TRUE)
                """,
                data,
            )

    @staticmethod
    def _save_features(cursor, variant_id, specs):
        category_cache = {}
        for item in specs:
            category_name = item["category"][:100]
            category_id = category_cache.get(category_name)
            if not category_id:
                cursor.execute(
                    """
                    INSERT INTO feature_categories (name)
                    VALUES (%s)
                    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
                    RETURNING id
                    """,
                    (category_name,),
                )
                category_id = cursor.fetchone()[0]
                category_cache[category_name] = category_id
            feature_name = item["name"][:150]
            cursor.execute(
                """
                INSERT INTO features (name, category_id)
                VALUES (%s, %s)
                ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
                RETURNING id
                """,
                (feature_name, category_id),
            )
            feature_id = cursor.fetchone()[0]
            cursor.execute(
                """
                INSERT INTO variant_features (variant_id, feature_id, value)
                VALUES (%s, %s, %s)
                ON CONFLICT (variant_id, feature_id) DO UPDATE SET value = EXCLUDED.value
                """,
                (variant_id, feature_id, item["value"]),
            )
