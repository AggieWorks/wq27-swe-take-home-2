-- +goose Up
-- +goose StatementBegin
SELECT
  'up SQL query';

-- Update existing columns with new requirements
ALTER TABLE
  public.deal
ALTER COLUMN
  name
SET
  NOT NULL,
ALTER COLUMN
  store
SET
  NOT NULL;

-- Rename image to redeem_image
ALTER TABLE
  public.deal RENAME COLUMN image TO redeem_image;

-- Add new columns
ALTER TABLE
  public.deal
ADD
  COLUMN expires_on DATE,
ADD
  COLUMN redeem_instructions TEXT,
ADD
  COLUMN is_verified BOOLEAN DEFAULT FALSE,
ADD
  COLUMN recurrence_frequency INTEGER,
ADD
  COLUMN recurrence_unit TEXT,
ADD
  COLUMN recurrence_days INTEGER [];

-- Drop columns that are no longer needed
ALTER TABLE
  public.deal DROP COLUMN IF EXISTS type,
  DROP COLUMN IF EXISTS url,
  DROP COLUMN IF EXISTS start_time,
  DROP COLUMN IF EXISTS end_time,
  DROP COLUMN IF EXISTS recurrence_type,
  DROP COLUMN IF EXISTS day_of_week,
  DROP COLUMN IF EXISTS week_of_month,
  DROP COLUMN IF EXISTS day_of_month;

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
SELECT
  'down SQL query';

-- Revert column constraints
ALTER TABLE
  public.deal
ALTER COLUMN
  name DROP NOT NULL,
ALTER COLUMN
  store DROP NOT NULL;

-- Rename redeem_image back to image
ALTER TABLE
  public.deal RENAME COLUMN redeem_image TO image;

-- Remove added columns
ALTER TABLE
  public.deal DROP COLUMN expires_on,
  DROP COLUMN redeem_instructions,
  DROP COLUMN is_verified,
  DROP COLUMN recurrence_frequency,
  DROP COLUMN recurrence_unit,
  DROP COLUMN recurrence_days;

-- Restore removed columns
ALTER TABLE
  public.deal
ADD
  COLUMN type TEXT,
ADD
  COLUMN url TEXT,
ADD
  COLUMN start_time TIMESTAMP WITH TIME ZONE,
ADD
  COLUMN end_time TIMESTAMP WITH TIME ZONE,
ADD
  COLUMN recurrence_type TEXT,
ADD
  COLUMN day_of_week SMALLINT,
ADD
  COLUMN week_of_month SMALLINT,
ADD
  COLUMN day_of_month SMALLINT;

-- +goose StatementEnd