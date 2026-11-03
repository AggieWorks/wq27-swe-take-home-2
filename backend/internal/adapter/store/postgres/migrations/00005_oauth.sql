-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
DELETE FROM public.user;
ALTER TABLE public.user ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE public.user ALTER COLUMN opted_in SET DEFAULT false;
ALTER TABLE public.user ADD COLUMN email text UNIQUE NOT NULL;
ALTER TABLE public.user ADD COLUMN nickname text NOT NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
ALTER TABLE public.user ALTER COLUMN phone SET NOT NULL;
ALTER TABLE public.user ALTER COLUMN opted_in SET DEFAULT true;
ALTER TABLE public.user DROP COLUMN email;
ALTER TABLE public.user DROP COLUMN nickname;
-- +goose StatementEnd
