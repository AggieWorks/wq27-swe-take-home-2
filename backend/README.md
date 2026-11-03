# Dibs API

The Dibs API is a backend service designed to manage information about deals and local businesses. It provides endpoints for creating, updating, and deleting deals, as well as retrieving details about local businesses. The API is built using Go and leverages Docker for containerization, ensuring a consistent development and deployment environment.

For more information, refer to [this Notion page](https://www.notion.so/aggieworks/API-Architecture-16c99f7761e4803d90d2e749c4f0c885?pvs=4).

## Prerequisites

Software to be installed:

1. [Go (1.23.0)](https://go.dev/dl/#go1.23.0)
2. [Docker Desktop](https://www.docker.com/products/docker-desktop/)
3. [Make](https://www.gnu.org/software/make/) - a build automation tool used to run predefined commands

## Getting Started

1. Start up Docker Desktop

2. Start/build containers for database and API.

    ```bash
    make start
    ```

3. Shut down containers after use. Note that the `[V=true]` flag will remove attached _volumes_ so you will lose database data.

    ```bash
    make stop [V=true]
    ```

4. Format Go files

    ```bash
    make fmt
    ```

5. Test all Go files

    ```bash
    make test
    ```

# Database

Currently, the Dibs API uses a **Postgres database** that runs in a Docker container (both locally and on production). The main interactions with this Postgres instance can be found within the `internal/adapter/store/postgres` package.

## Folder Structure

```
internal/
└── adapter/
    └── store/
        └── postgres/
            ├── migrations/
            │   └── *.sql
            ├── repository/
            │   └── *.go
            ├── seed/
            │   └── *.sql
            └── db.go
```

-   `migrations` - contains migration files that define schema updates to the database such as new tables
-   `repository` - contains implementations of repository interfaces defined in `core/port`
-   `seed` - contains files to seed data into the database (used for development purposes)
-   `db.go` - contains logic to create a new Postgres service; handles migrations and creates a `*gorm.DB` instance that can be used by repositories

## Makefile Commands

The Makefile has commands that allow you to create new migrations, apply/rollback migrations, and seed the database. This is useful in local development to avoid having to manually input lots of data at once to test functionality.

### Prerequisites

-   [`goose`](https://github.com/pressly/goose) - database migration tool
-   [`make`](https://www.gnu.org/software/make/) - controls commands

### Usage

Use `make help` to get help on what commands are available.

For handling migrations:

-   `make create name=<name>` - creates new migration file
-   `make up` - apply all pending migrations
-   `make down` - roll back last migration

For seeding data (migrations must be applied for seeding to succeed):

-   `make seed-create name=<name>` - create new seed file
-   `make seed-up` - apply all seed files
-   `make seed-down` - roll back seeds
