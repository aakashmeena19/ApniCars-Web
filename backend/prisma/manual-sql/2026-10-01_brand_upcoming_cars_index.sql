-- Supports brand-scoped upcoming-car listings ordered by expected launch date.
-- CONCURRENTLY cannot run inside BEGIN/COMMIT.
CREATE INDEX CONCURRENTLY IF NOT EXISTS car_models_brand_launch_expected_idx
  ON car_models (brand_id, launch_status, expected_launch_date);
