-- +goose Up
-- SQL for seeding up
-- Insert Test Users
INSERT INTO
  "user"(
    id,
    phone,
    opted_in,
    role,
    email,
    nickname,
    created_at,
    updated_at
  )
VALUES
  (
    '823e4567-e89b-12d3-a456-426614174000',
    '+14437990239',
    TRUE,
    'admin',
    'dibs.ucd@gmail.com',
    'Dibs',
    now(),
    now()
  ),
  (
    '723e4567-e89b-12d3-a456-426614174000',
    '+14437990238',
    TRUE,
    'user',
    'aggieworksatucd@gmail.com',
    'AggieWorks',
    now(),
    now()
  ),
  (
    '923e4567-e89b-12d3-a456-426614174000',
    '+14437990240',
    TRUE,
    'user',
    'bobby@gmail.com',
    'Bobby',
    now(),
    now()
  );

-- Insert Deals
INSERT INTO
  deal(
    id,
    name,
    description,
    created_at,
    updated_at,
    is_exclusive,
    user_id,
    expires_on,
    redeem_instructions,
    is_verified,
    recurrence_frequency,
    recurrence_unit,
    recurrence_days,
    redeem_image,
    business_id
  )
VALUES
  (
    'be21d1ae-94e3-4ea4-95f7-984f31cfa34a',
    'Buy 1 Get One Free on Any Donut of Choice',
    'Buy one donut, get one donut free- limit one free donut per customer per visit.',
    '2025-03-31T17:14:16.753185Z',
    '2025-04-26T20:07:30.750051Z',
    FALSE,
    '823e4567-e89b-12d3-a456-426614174000',
    NULL,
    NULL,
    TRUE,
    NULL,
    NULL,
    '{}',
    NULL,
    'b23e4567-e89b-12d3-a456-426614174001'
  ),
  (
    '7d9d45cd-0334-4161-a858-25ec8d8768f2',
    '$10 Blaze Combo',
    '2-top pizza and drink for $10 at Blaze for students who show their UC Davis ID on weekdays!',
    '2025-04-13T08:31:53.083409Z',
    '2025-04-13T08:31:53.083409Z',
    FALSE,
    '823e4567-e89b-12d3-a456-426614174000',
    NULL,
    'Show your UC Davis ID for $10 combo',
    FALSE,
    NULL,
    NULL,
    NULL,
    '',
    'b23e4567-e89b-12d3-a456-426614174002'
  ),
  (
    '517e125b-003c-435e-bded-dcbb9ccfbb5f',
    '$12 Fish and Chips',
    'Only on Mondays',
    '2025-03-31T17:26:40.459505Z',
    '2025-03-31T17:26:40.459505Z',
    FALSE,
    '823e4567-e89b-12d3-a456-426614174000',
    NULL,
    NULL,
    TRUE,
    NULL,
    NULL,
    NULL,
    NULL,
    'b23e4567-e89b-12d3-a456-426614174002'
  ),
  (
    'f9b5ac68-244e-495d-82e6-1b9184f12bbe',
    '$1 Off Yogurt Order',
    'Minimum 8oz',
    '2025-03-31T17:11:08.611265Z',
    '2025-03-31T17:11:08.611265Z',
    TRUE,
    '823e4567-e89b-12d3-a456-426614174000',
    '2025-07-01T00:00:00Z',
    NULL,
    TRUE,
    NULL,
    NULL,
    NULL,
    '',
    'b23e4567-e89b-12d3-a456-426614174003'
  ),
  (
    '9cd3dfb5-5466-427e-b964-3b0ead64012b',
    '15% Off Order',
    NULL,
    '2025-04-14T23:06:38.971053Z',
    '2025-04-14T23:06:38.971053Z',
    FALSE,
    '823e4567-e89b-12d3-a456-426614174000',
    NULL,
    'Must show student ID',
    TRUE,
    1,
    'day',
    '{}',
    NULL,
    'b23e4567-e89b-12d3-a456-426614174004'
  ),
  (
    '2deeb228-7684-4cdd-a25a-968791f8d4db',
    'AYCE Slices for $12.45',
    '11 am to 2 pm',
    '2025-04-15T05:09:48.436989Z',
    '2025-04-15T05:09:48.436989Z',
    FALSE,
    '823e4567-e89b-12d3-a456-426614174000',
    NULL,
    NULL,
    TRUE,
    1,
    'day',
    '{}',
    NULL,
    'b23e4567-e89b-12d3-a456-426614174005'
  ),
  (
    '14b32f08-64e5-49e9-b9fe-5a34c9f9cd72',
    '1-Topping Pizza and Drink for $9.49',
    '11 AM to 2 PM only',
    '2025-04-15T05:18:14.39247Z',
    '2025-04-15T05:18:14.39247Z',
    FALSE,
    '823e4567-e89b-12d3-a456-426614174000',
    NULL,
    NULL,
    TRUE,
    1,
    'day',
    '{}',
    NULL,
    'b23e4567-e89b-12d3-a456-426614174006'
  ),
  (
    '44b7ad64-2c0e-440b-ab42-4549223b36e2',
    '$10 Lunch Buffet',
    '11 AM to 2 PM',
    '2025-04-15T05:37:45.278035Z',
    '2025-04-15T05:37:45.278035Z',
    FALSE,
    '823e4567-e89b-12d3-a456-426614174000',
    NULL,
    NULL,
    TRUE,
    1,
    'week',
    '{1,2,3,4,5}',
    NULL,
    'b23e4567-e89b-12d3-a456-426614174007'
  ),
  (
    '071f3056-ed97-4d8e-b8ce-d46b3c33a05a',
    '$0.80 Per Wing',
    NULL,
    '2025-04-15T05:39:00.299755Z',
    '2025-04-15T05:39:00.299755Z',
    FALSE,
    '823e4567-e89b-12d3-a456-426614174000',
    NULL,
    NULL,
    TRUE,
    1,
    'week',
    '{1,2}',
    NULL,
    'b23e4567-e89b-12d3-a456-426614174008'
  ),
  (
    'e11106e7-9d37-4116-b819-d10ced190567',
    '50% Off Beer and Cocktail Pitchers',
    NULL,
    '2025-04-15T05:39:41.886358Z',
    '2025-04-15T05:39:41.886358Z',
    FALSE,
    '823e4567-e89b-12d3-a456-426614174000',
    NULL,
    NULL,
    TRUE,
    1,
    'week',
    '{0}',
    NULL,
    'b23e4567-e89b-12d3-a456-426614174009'
  );

-- Insert Likes
INSERT INTO
  "like"(user_id, deal_id, created_at)
VALUES
  (
    '823e4567-e89b-12d3-a456-426614174000',
    'be21d1ae-94e3-4ea4-95f7-984f31cfa34a',
    now()
  ),
  (
    '723e4567-e89b-12d3-a456-426614174000',
    '7d9d45cd-0334-4161-a858-25ec8d8768f2',
    now()
  ),
  (
    '923e4567-e89b-12d3-a456-426614174000',
    '517e125b-003c-435e-bded-dcbb9ccfbb5f',
    now()
  );

-- +goose Down
-- SQL for seeding down
DELETE FROM
  "like";

DELETE FROM
  deal;

DELETE FROM
  "user";