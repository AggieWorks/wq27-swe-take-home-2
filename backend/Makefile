include ../.env

# Variables
GOOSE_CMD=goose
MIGRATIONS_DIR=internal/adapter/store/postgres/migrations
SEEDS_DIR=internal/adapter/store/postgres/seed
DB_URL=postgres://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@localhost:$(POSTGRES_PORT)/$(POSTGRES_DB)?sslmode=$(POSTGRES_SSLMODE)

# Help
.PHONY: help
help:
	@echo "Usage:"
	@echo ""
	@echo "General Commands:"
	@echo "  make fmt                  Format code"
	@echo "  make test                 Run tests"
	@echo ""
	@echo "Server Commands:"
	@echo "  make start                Start backend server and database"
	@echo "  make stop [V=true]        Stop backend server and database (delete volumes if V=true is provided)"
	@echo ""
	@echo "Migration Commands:"
	@echo "  make init                 Initialize migrations directory"
	@echo "  make create name=<name>   Create a new migration file"
	@echo "  make up                   Apply all pending migrations"
	@echo "  make down                 Roll back the last migration"
	@echo "  make redo                 Roll back the last migration and reapply it"
	@echo "  make status               Show migration status"
	@echo "  make reset                Roll back all migrations and reapply them"
	@echo "  make version              Show the current migration version"
	@echo ""
	@echo "Seeding Commands:"
	@echo "  make seed-create name=<name>  Create a new seed file"
	@echo "  make seed-up                  Apply all seed files (no versioning)"
	@echo "  make seed-down                Roll back seeds"


# Format code
.PHONY: fmt
fmt:
	@gofmt -s -w .

# Test code
.PHONY: test
test:
	@go test -v ./...

# Start backend server and database
.PHONY: start
start:
	@echo "Starting backend..."
	@docker compose -f ../compose.yaml up -d

# Stop backend server and database
.PHONY: stop
stop:
	@echo "Stopping backend..."
	@docker compose down $(if $(V),-v)


# Initialize database and migrations directory
.PHONY: init
init:
	@echo "Creating database $(POSTGRES_DB)..."
	@PGPASSWORD=$(POSTGRES_PASSWORD) createdb -h localhost -p $(POSTGRES_PORT) -U $(POSTGRES_USER) $(POSTGRES_DB) || true
	@echo "Creating migrations directory..."
	@mkdir -p $(MIGRATIONS_DIR)
	@mkdir -p $(SEEDS_DIR)

# Create a new migration
.PHONY: create
create:
	@if [ -z "$(name)" ]; then \
		echo "Error: Missing migration name. Usage: make create name=<name>"; \
		exit 1; \
	fi
	$(GOOSE_CMD) create -s -dir $(MIGRATIONS_DIR) $(name) sql

# Apply all pending migrations
.PHONY: up
up:
	$(GOOSE_CMD) -dir $(MIGRATIONS_DIR) postgres "$(DB_URL)" up

# Roll back the last migration
.PHONY: down
down:
	$(GOOSE_CMD) -dir $(MIGRATIONS_DIR) postgres "$(DB_URL)" down

# Roll back the last migration and reapply it
.PHONY: redo
redo:
	$(GOOSE_CMD) -dir $(MIGRATIONS_DIR) postgres "$(DB_URL)" redo

# Show migration status
.PHONY: status
status:
	$(GOOSE_CMD) -dir $(MIGRATIONS_DIR) postgres "$(DB_URL)" status

# Roll back all migrations and reapply them
.PHONY: reset
reset:
	$(GOOSE_CMD) -dir $(MIGRATIONS_DIR) postgres "$(DB_URL)" reset

# Show the current migration version
.PHONY: version
version:
	$(GOOSE_CMD) -dir $(MIGRATIONS_DIR) postgres "$(DB_URL)" version

# Create a new seed file
.PHONY: seed-create
seed-create:
	@if [ -z "$(name)" ]; then \
		echo "Error: Missing seed name. Usage: make seed-create name=<name>"; \
		exit 1; \
	fi
	$(GOOSE_CMD) create -s -dir $(SEEDS_DIR) $(name) sql

# Apply all seed files (no versioning)
.PHONY: seed-up
seed-up:
	$(GOOSE_CMD) -dir $(SEEDS_DIR) postgres "$(DB_URL)" up -no-versioning

# Roll back seeds
.PHONY: seed-down
seed-down:
	$(GOOSE_CMD) -dir $(SEEDS_DIR) postgres "$(DB_URL)" -no-versioning down-to 0