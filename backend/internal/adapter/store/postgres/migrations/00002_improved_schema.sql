-- +goose Up
-- +goose StatementBegin
ALTER TABLE
	public.deal
ADD
	COLUMN recurrence_type text,
ADD
	COLUMN day_of_week smallint,
ADD
	COLUMN week_of_month smallint,
ADD
	COLUMN day_of_month smallint,
ALTER COLUMN
	created_at
SET
	DEFAULT now(),
ALTER COLUMN
	created_at
SET
	NOT NULL,
ALTER COLUMN
	updated_at
SET
	DEFAULT now(),
ALTER COLUMN
	updated_at
SET
	NOT NULL;

ALTER TABLE
	public.business_hour
ALTER COLUMN
	day_of_week TYPE smallint,
ALTER COLUMN
	open_time TYPE smallint,
ALTER COLUMN
	close_time TYPE smallint,
ALTER COLUMN
	created_at
SET
	DEFAULT now(),
ALTER COLUMN
	created_at
SET
	NOT NULL,
ALTER COLUMN
	updated_at
SET
	DEFAULT now(),
ALTER COLUMN
	updated_at
SET
	NOT NULL;

ALTER TABLE
	public.business
ALTER COLUMN
	created_at
SET
	DEFAULT now(),
ALTER COLUMN
	created_at
SET
	NOT NULL,
ALTER COLUMN
	updated_at
SET
	DEFAULT now(),
ALTER COLUMN
	updated_at
SET
	NOT NULL;

ALTER TABLE
	public."user"
ALTER COLUMN
	created_at
SET
	DEFAULT now(),
ALTER COLUMN
	created_at
SET
	NOT NULL,
ALTER COLUMN
	updated_at
SET
	DEFAULT now(),
ALTER COLUMN
	updated_at
SET
	NOT NULL;

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
ALTER TABLE
	public.deal DROP COLUMN recurrence_type,
	DROP COLUMN day_of_week,
	DROP COLUMN week_of_month,
	DROP COLUMN day_of_month,
ALTER COLUMN
	created_at DROP DEFAULT,
ALTER COLUMN
	created_at DROP NOT NULL,
ALTER COLUMN
	updated_at DROP DEFAULT,
ALTER COLUMN
	updated_at DROP NOT NULL;

ALTER TABLE
	public.business_hour
ALTER COLUMN
	day_of_week TYPE bigint,
ALTER COLUMN
	open_time TYPE bigint,
ALTER COLUMN
	close_time TYPE bigint,
ALTER COLUMN
	created_at DROP DEFAULT,
ALTER COLUMN
	created_at DROP NOT NULL,
ALTER COLUMN
	updated_at DROP DEFAULT,
ALTER COLUMN
	updated_at DROP NOT NULL;

ALTER TABLE
	public.business
ALTER COLUMN
	created_at DROP DEFAULT,
ALTER COLUMN
	created_at DROP NOT NULL,
ALTER COLUMN
	updated_at DROP DEFAULT,
ALTER COLUMN
	updated_at DROP NOT NULL;

ALTER TABLE
	public."user"
ALTER COLUMN
	created_at DROP DEFAULT,
ALTER COLUMN
	created_at DROP NOT NULL,
ALTER COLUMN
	updated_at DROP DEFAULT,
ALTER COLUMN
	updated_at DROP NOT NULL;

-- +goose StatementEnd