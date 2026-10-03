BEGIN;

ALTER TABLE car_variants
  ADD COLUMN slug VARCHAR(160);

ALTER TABLE car_variants
  ADD CONSTRAINT car_variants_model_id_slug_key
  UNIQUE (model_id, slug);

COMMIT;
