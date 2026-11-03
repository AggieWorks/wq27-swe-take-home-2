-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
ALTER TABLE public.deal ADD COLUMN image text DEFAULT '';
ALTER TABLE public.deal ADD COLUMN is_exclusive boolean DEFAULT false;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
ALTER TABLE public.deal DROP COLUMN image;
ALTER TABLE public.deal DROP COLUMN is_exclusive;
-- +goose StatementEnd
