-- +goose Up
-- +goose StatementBegin
SELECT
  'up SQL query';

-- First create the business_id column
ALTER TABLE
  deal
ADD
  COLUMN business_id UUID;

-- Drop unique constraint on business image
ALTER TABLE
  business DROP CONSTRAINT IF EXISTS business_image_key;

-- Insert businesses first (because deals will reference these)
INSERT INTO
  business(id, name, address, image, created_at, updated_at)
VALUES
  (
    'b23e4567-e89b-12d3-a456-426614174001',
    'Fluffy Donuts',
    '1260 Lake Blvd #110, Davis, CA 95616',
    'https://images.dibs.deals/fluffy_donuts.jpeg',
    now(),
    now()
  ),
  (
    'b23e4567-e89b-12d3-a456-426614174002',
    'Tim''s Hawaiian BBQ DT',
    '516 2nd St, Davis, CA 95616',
    'https://images.dibs.deals/tims_hawaiian_bbq_dt.webp',
    now(),
    now()
  ),
  (
    'b23e4567-e89b-12d3-a456-426614174003',
    'Aggie Yogurt',
    '425 2nd St, Davis, CA 95616',
    'https://images.dibs.deals/aggie_yogurt.avif',
    now(),
    now()
  ),
  (
    'b23e4567-e89b-12d3-a456-426614174004',
    'El Patio',
    '200 E St, Davis, CA 95616',
    'https://images.dibs.deals/el_patio_fresh_mexican_grill.jpg',
    now(),
    now()
  ),
  (
    'b23e4567-e89b-12d3-a456-426614174005',
    'Woodstocks',
    '238 G St, Davis, CA 95616',
    'https://images.dibs.deals/woodstocks_pizza_davis.jpg',
    now(),
    now()
  ),
  (
    'b23e4567-e89b-12d3-a456-426614174006',
    'Steves',
    '314 F St, Davis, CA 95616',
    'https://images.dibs.deals/steves_pizza.jpg',
    now(),
    now()
  ),
  (
    'b23e4567-e89b-12d3-a456-426614174007',
    'Mountain Mike''s',
    '1411 W Covell Blvd Suite 111, Davis, CA 95616',
    'https://images.dibs.deals/mountain_mikes.jpg',
    now(),
    now()
  ),
  (
    'b23e4567-e89b-12d3-a456-426614174008',
    'Wingstop',
    '408 G St, Davis, CA 95616',
    'https://images.dibs.deals/wingstop.avif',
    now(),
    now()
  ),
  (
    'b23e4567-e89b-12d3-a456-426614174009',
    'Red 88',
    '223 G St, Davis, CA 95616',
    'https://images.dibs.deals/red_88_davis.avif',
    now(),
    now()
  ),
  (
    'b23e4567-e89b-12d3-a456-426614174010',
    'Thai Canteen',
    '117 E St, Davis, CA 95616',
    'https://images.dibs.deals/thai_canteen.webp',
    now(),
    now()
  ),
  (
    'b23e4567-e89b-12d3-a456-426614174011',
    'Maya''s',
    '237 D St, Davis, CA 95616',
    'https://images.dibs.deals/mayas.webp',
    now(),
    now()
  ),
  (
    'b23e4567-e89b-12d3-a456-426614174012',
    'Shipwrecked Tiki Bar',
    '217 G St, Davis, CA 95616',
    'https://images.dibs.deals/shipwrecked.jpg',
    now(),
    now()
  ),
  (
    'b23e4567-e89b-12d3-a456-426614174013',
    'Acai Fresh',
    '431 G St, Davis, CA 95616t',
    'https://images.dibs.deals/acai_fresh.avif',
    now(),
    now()
  ),
  (
    'b23e4567-e89b-12d3-a456-426614174014',
    'Ume Tea',
    '1411 W Covell Blvd Suite 110, Davis, CA 95616',
    '',
    now(),
    now()
  ),
  (
    'b23e4567-e89b-12d3-a456-426614174015',
    'Mr. Pickle''s Sandwich Shop',
    '2191 Cowell Blvd , Ste. F Davis, CA 95618',
    '',
    now(),
    now()
  ),
  (
    'b23e4567-e89b-12d3-a456-426614174016',
    'Fire Wings',
    '640 W Covell Blvd F, Davis, CA 95616',
    '',
    now(),
    now()
  );

-- Map existing deals to business_ids
UPDATE
  deal d
SET
  business_id = b.id
FROM
  business b
WHERE
  d.store = b.name;

-- Add foreign key constraint after data is mapped
ALTER TABLE
  deal
ALTER COLUMN
  business_id
SET
  NOT NULL;

ALTER TABLE
  deal
ADD
  CONSTRAINT fk_business_id FOREIGN KEY (business_id) REFERENCES business(id);

-- Drop old columns last (after constraints are in place)
ALTER TABLE
  deal DROP COLUMN IF EXISTS image;

ALTER TABLE
  deal DROP COLUMN store;

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
SELECT
  'down SQL query';

-- First add back the columns we'll need
ALTER TABLE
  deal
ADD
  COLUMN store text;

ALTER TABLE
  deal
ADD
  COLUMN image text;

-- Map business names back to store column before dropping the relationship
UPDATE
  deal d
SET
  store = b.name
FROM
  business b
WHERE
  d.business_id = b.id;

-- Make store not null before dropping business_id
ALTER TABLE
  deal
ALTER COLUMN
  store
SET
  NOT NULL;

-- Remove the constraint and column
ALTER TABLE
  deal DROP CONSTRAINT fk_business_id;

ALTER TABLE
  deal DROP COLUMN business_id;

-- Delete businesses last (after removing foreign key constraint)
DELETE FROM
  business;

-- +goose StatementEnd