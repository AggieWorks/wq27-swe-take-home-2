-- +goose Up
-- +goose StatementBegin
SELECT
  'up SQL query';

-- Rename redeem_image to image
ALTER TABLE
  public.deal RENAME COLUMN redeem_image TO image;

-- Add new redeem_image column
ALTER TABLE
  public.deal
ADD
  COLUMN redeem_image TEXT;

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
SELECT
  'down SQL query';

-- Drop the new redeem_image column
ALTER TABLE
  public.deal DROP COLUMN redeem_image;

-- Rename image back to redeem_image
ALTER TABLE
  public.deal RENAME COLUMN image TO redeem_image;

-- +goose StatementEnd