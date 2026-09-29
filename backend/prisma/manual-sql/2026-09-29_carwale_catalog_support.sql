BEGIN;

ALTER TABLE "variant_features"
ALTER COLUMN "value" TYPE TEXT;

ALTER TABLE "car_images"
ADD COLUMN "category" VARCHAR(30),
ADD COLUMN "caption" VARCHAR(150),
ADD COLUMN "sort_order" INTEGER NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX "car_colors_model_id_color_name_key"
ON "car_colors" ("model_id", "color_name");

CREATE UNIQUE INDEX "car_images_model_id_image_url_key"
ON "car_images" ("model_id", "image_url");

COMMIT;
