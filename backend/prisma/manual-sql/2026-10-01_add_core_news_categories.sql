BEGIN;

INSERT INTO news_categories
  (name, slug, is_active, created_at, updated_at)
VALUES
  ('Latest Car News', 'latest-car-news', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('New Car Launches', 'new-car-launches', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Car Reviews', 'car-reviews', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Buying Guides', 'buying-guides', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Electric Cars', 'electric-cars', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (slug) DO NOTHING;

COMMIT;
