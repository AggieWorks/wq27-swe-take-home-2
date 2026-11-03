-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

-- SQL in this section is executed when the migration is applied
ALTER TABLE business ADD COLUMN cuisine_type TEXT;

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd

-- SQL in this section is executed when the migration is rolled back
ALTER TABLE business DROP COLUMN cuisine_type;
