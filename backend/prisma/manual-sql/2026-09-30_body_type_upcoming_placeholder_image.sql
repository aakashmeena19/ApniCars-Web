BEGIN;

ALTER TABLE body_types
ADD COLUMN IF NOT EXISTS upcoming_placeholder_image_url VARCHAR(255);

COMMIT;
