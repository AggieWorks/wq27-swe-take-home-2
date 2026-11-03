-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE public.like (
    user_id uuid NOT NULL,
    deal_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (user_id, deal_id),
    FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE,
    FOREIGN KEY (deal_id) REFERENCES public.deal(id) ON DELETE CASCADE
);

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
SELECT'down SQL query';
DROP TABLE public.like;

-- +goose StatementEnd