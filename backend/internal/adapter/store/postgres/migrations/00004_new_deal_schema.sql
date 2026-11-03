-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
ALTER TABLE public.deal
DROP COLUMN business_id,
DROP COLUMN day_of_week,
DROP COLUMN week_of_month,
DROP COLUMN day_of_month,
ADD COLUMN store text,
ADD COLUMN type text,
ADD COLUMN url text,
ADD COLUMN user_id uuid NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
ALTER COLUMN image DROP DEFAULT,
ALTER COLUMN name SET NOT NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
ALTER TABLE public.deal
ADD COLUMN business_id uuid,
ADD COLUMN day_of_week integer,
ADD COLUMN week_of_month integer,
ADD COLUMN day_of_month integer,
DROP COLUMN store,
DROP COLUMN type,
DROP COLUMN url,
DROP COLUMN user_id,
ALTER COLUMN image SET DEFAULT '';
-- +goose StatementEnd
