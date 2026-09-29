/*
  Warnings:

  - You are about to drop the column `article_schema` on the `seo_meta` table. All the data in the column will be lost.
  - You are about to drop the `article_brands` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `article_car_models` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `article_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `articles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `codex_article_brands` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `codex_article_car_models` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `codex_articles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `codex_brands` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `codex_car_color_shades` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `codex_car_colors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `codex_car_faqs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `codex_car_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `codex_car_models` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `codex_car_variants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `codex_feature_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `codex_features` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `codex_powertrains_electric` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `codex_powertrains_ice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `codex_proposal_events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `codex_runs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `codex_variant_features` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `codex_variant_price_changes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `new_car_offers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `story_groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `story_items` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "article_brands" DROP CONSTRAINT "article_brands_article_id_fkey";

-- DropForeignKey
ALTER TABLE "article_brands" DROP CONSTRAINT "article_brands_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "article_car_models" DROP CONSTRAINT "article_car_models_article_id_fkey";

-- DropForeignKey
ALTER TABLE "article_car_models" DROP CONSTRAINT "article_car_models_model_id_fkey";

-- DropForeignKey
ALTER TABLE "article_categories" DROP CONSTRAINT "article_categories_created_by_fkey";

-- DropForeignKey
ALTER TABLE "article_categories" DROP CONSTRAINT "article_categories_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "articles_author_id_fkey";

-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "articles_category_id_fkey";

-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "articles_created_by_fkey";

-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "articles_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "codex_article_brands" DROP CONSTRAINT "codex_article_brands_codex_article_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_article_brands" DROP CONSTRAINT "codex_article_brands_codex_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_article_brands" DROP CONSTRAINT "codex_article_brands_run_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_article_car_models" DROP CONSTRAINT "codex_article_car_models_codex_article_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_article_car_models" DROP CONSTRAINT "codex_article_car_models_codex_model_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_article_car_models" DROP CONSTRAINT "codex_article_car_models_run_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_articles" DROP CONSTRAINT "codex_articles_run_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_brands" DROP CONSTRAINT "codex_brands_run_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_car_color_shades" DROP CONSTRAINT "codex_car_color_shades_codex_color_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_car_color_shades" DROP CONSTRAINT "codex_car_color_shades_run_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_car_colors" DROP CONSTRAINT "codex_car_colors_codex_model_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_car_colors" DROP CONSTRAINT "codex_car_colors_run_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_car_faqs" DROP CONSTRAINT "codex_car_faqs_codex_model_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_car_faqs" DROP CONSTRAINT "codex_car_faqs_run_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_car_images" DROP CONSTRAINT "codex_car_images_codex_color_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_car_images" DROP CONSTRAINT "codex_car_images_codex_model_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_car_images" DROP CONSTRAINT "codex_car_images_run_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_car_models" DROP CONSTRAINT "codex_car_models_codex_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_car_models" DROP CONSTRAINT "codex_car_models_run_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_car_variants" DROP CONSTRAINT "codex_car_variants_codex_model_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_car_variants" DROP CONSTRAINT "codex_car_variants_run_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_feature_categories" DROP CONSTRAINT "codex_feature_categories_run_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_features" DROP CONSTRAINT "codex_features_codex_category_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_features" DROP CONSTRAINT "codex_features_run_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_powertrains_electric" DROP CONSTRAINT "codex_powertrains_electric_codex_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_powertrains_electric" DROP CONSTRAINT "codex_powertrains_electric_run_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_powertrains_ice" DROP CONSTRAINT "codex_powertrains_ice_codex_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_powertrains_ice" DROP CONSTRAINT "codex_powertrains_ice_run_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_proposal_events" DROP CONSTRAINT "codex_proposal_events_run_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_variant_features" DROP CONSTRAINT "codex_variant_features_codex_feature_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_variant_features" DROP CONSTRAINT "codex_variant_features_codex_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_variant_features" DROP CONSTRAINT "codex_variant_features_run_id_fkey";

-- DropForeignKey
ALTER TABLE "codex_variant_price_changes" DROP CONSTRAINT "codex_variant_price_changes_run_id_fkey";

-- DropForeignKey
ALTER TABLE "new_car_offers" DROP CONSTRAINT "new_car_offers_city_id_fkey";

-- DropForeignKey
ALTER TABLE "new_car_offers" DROP CONSTRAINT "new_car_offers_model_id_fkey";

-- DropForeignKey
ALTER TABLE "new_car_offers" DROP CONSTRAINT "new_car_offers_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "story_groups" DROP CONSTRAINT "story_groups_created_by_fkey";

-- DropForeignKey
ALTER TABLE "story_groups" DROP CONSTRAINT "story_groups_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "story_items" DROP CONSTRAINT "story_items_created_by_fkey";

-- DropForeignKey
ALTER TABLE "story_items" DROP CONSTRAINT "story_items_group_id_fkey";

-- DropForeignKey
ALTER TABLE "story_items" DROP CONSTRAINT "story_items_updated_by_fkey";

-- AlterTable
ALTER TABLE "seo_meta" DROP COLUMN "article_schema",
ADD COLUMN     "news_schema" TEXT;

-- DropTable
DROP TABLE "article_brands";

-- DropTable
DROP TABLE "article_car_models";

-- DropTable
DROP TABLE "article_categories";

-- DropTable
DROP TABLE "articles";

-- DropTable
DROP TABLE "codex_article_brands";

-- DropTable
DROP TABLE "codex_article_car_models";

-- DropTable
DROP TABLE "codex_articles";

-- DropTable
DROP TABLE "codex_brands";

-- DropTable
DROP TABLE "codex_car_color_shades";

-- DropTable
DROP TABLE "codex_car_colors";

-- DropTable
DROP TABLE "codex_car_faqs";

-- DropTable
DROP TABLE "codex_car_images";

-- DropTable
DROP TABLE "codex_car_models";

-- DropTable
DROP TABLE "codex_car_variants";

-- DropTable
DROP TABLE "codex_feature_categories";

-- DropTable
DROP TABLE "codex_features";

-- DropTable
DROP TABLE "codex_powertrains_electric";

-- DropTable
DROP TABLE "codex_powertrains_ice";

-- DropTable
DROP TABLE "codex_proposal_events";

-- DropTable
DROP TABLE "codex_runs";

-- DropTable
DROP TABLE "codex_variant_features";

-- DropTable
DROP TABLE "codex_variant_price_changes";

-- DropTable
DROP TABLE "new_car_offers";

-- DropTable
DROP TABLE "story_groups";

-- DropTable
DROP TABLE "story_items";

-- CreateTable
CREATE TABLE "news_categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "title" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "excerpt" VARCHAR(300),
    "body" TEXT,
    "cover_image_url" VARCHAR(255),
    "read_time_minutes" INTEGER,
    "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "scheduled_at" TIMESTAMP(3),
    "published_at" TIMESTAMP(3),
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "meta_title" VARCHAR(160),
    "meta_description" VARCHAR(300),
    "meta_keywords" VARCHAR(255),
    "og_image_url" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_brands" (
    "id" SERIAL NOT NULL,
    "news_id" INTEGER NOT NULL,
    "brand_id" INTEGER NOT NULL,

    CONSTRAINT "news_brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_car_models" (
    "id" SERIAL NOT NULL,
    "news_id" INTEGER NOT NULL,
    "model_id" INTEGER NOT NULL,

    CONSTRAINT "news_car_models_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "news_categories_slug_key" ON "news_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "news_slug_key" ON "news"("slug");

-- CreateIndex
CREATE INDEX "news_status_is_active_published_at_idx" ON "news"("status", "is_active", "published_at");

-- CreateIndex
CREATE INDEX "news_category_id_idx" ON "news"("category_id");

-- CreateIndex
CREATE INDEX "news_brands_brand_id_idx" ON "news_brands"("brand_id");

-- CreateIndex
CREATE UNIQUE INDEX "news_brands_news_id_brand_id_key" ON "news_brands"("news_id", "brand_id");

-- CreateIndex
CREATE INDEX "news_car_models_model_id_idx" ON "news_car_models"("model_id");

-- CreateIndex
CREATE UNIQUE INDEX "news_car_models_news_id_model_id_key" ON "news_car_models"("news_id", "model_id");

-- AddForeignKey
ALTER TABLE "news_categories" ADD CONSTRAINT "news_categories_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_categories" ADD CONSTRAINT "news_categories_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "news_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_brands" ADD CONSTRAINT "news_brands_news_id_fkey" FOREIGN KEY ("news_id") REFERENCES "news"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_brands" ADD CONSTRAINT "news_brands_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_car_models" ADD CONSTRAINT "news_car_models_news_id_fkey" FOREIGN KEY ("news_id") REFERENCES "news"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_car_models" ADD CONSTRAINT "news_car_models_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "car_models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
