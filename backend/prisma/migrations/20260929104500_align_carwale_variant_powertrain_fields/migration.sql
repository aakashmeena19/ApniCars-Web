ALTER TABLE "car_variants"
ADD COLUMN "vehicle_warranty_raw" VARCHAR(100);

ALTER TABLE "car_powertrains_ice"
RENAME COLUMN "fuel_type_sub_category" TO "engine_type";

ALTER TABLE "car_powertrains_ice"
ALTER COLUMN "engine_type" TYPE VARCHAR(100);

ALTER TABLE "car_powertrains_ice"
RENAME COLUMN "cubic_capacity" TO "displacement_cc";

ALTER TABLE "car_powertrains_ice"
DROP COLUMN "engine_displacement";

ALTER TABLE "car_powertrains_ice"
RENAME COLUMN "top_speed_time_sec" TO "acceleration_0_100_sec";

ALTER TABLE "car_powertrains_electric"
RENAME COLUMN "top_speed_time_sec" TO "acceleration_0_100_sec";

ALTER TABLE "car_powertrains_electric"
ADD COLUMN "battery_warranty_raw" VARCHAR(100);

ALTER TABLE "car_powertrains_electric"
DROP COLUMN "standard_warranty_km",
DROP COLUMN "standard_warranty_years",
DROP COLUMN "emission_norm_compliance";
