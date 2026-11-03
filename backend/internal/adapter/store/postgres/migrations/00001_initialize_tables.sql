-- +goose Up
-- +goose StatementBegin
CREATE TABLE public.business (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	name text NOT NULL UNIQUE,
    address text NOT NULL UNIQUE,
    image text NOT NULL UNIQUE,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);

CREATE TABLE public.business_hour (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	business_id uuid NOT NULL REFERENCES business (id) ON DELETE CASCADE,
    day_of_week bigint,
    open_time bigint,
    close_time bigint,
    is_closed boolean DEFAULT false,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);

CREATE TABLE public.deal (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    name text,
    description text,
    business_id uuid NOT NULL REFERENCES business (id) ON DELETE CASCADE,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);

CREATE TYPE user_role AS ENUM ('user', 'admin');

CREATE TABLE public."user" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    phone text NOT NULL,
    opted_in boolean DEFAULT true,
    role user_role DEFAULT 'user',
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.business, public.business_hour, public.deal, public."user";
DROP TYPE IF EXISTS user_role;
-- +goose StatementEnd
