-- Supports cached adjacent-variant lookups ordered by price.
-- PostgreSQL does not allow CREATE INDEX CONCURRENTLY inside BEGIN/COMMIT.
CREATE INDEX CONCURRENTLY IF NOT EXISTS car_variants_model_id_price_idx
ON public.car_variants (model_id, price);
