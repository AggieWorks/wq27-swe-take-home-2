package testhelpers

import (
	"context"
	"strings"
	"time"

	"github.com/aggieworks/dibs/internal/config"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/postgres"
	"github.com/testcontainers/testcontainers-go/wait"
)

type PostgresContainer struct {
	*postgres.PostgresContainer
	DBCfg *config.DB
}

// CreateTestPostgresContainer creates a new test Postgres Docker container instance.
func CreateTestPostgresContainer(ctx context.Context) (*PostgresContainer, error) {
	pgContainer, err := postgres.Run(ctx,
		"postgres:16-alpine",
		postgres.WithDatabase("test"),
		postgres.WithUsername("username"),
		postgres.WithPassword("password"),
		testcontainers.WithWaitStrategy(
			wait.ForLog("database system is ready to accept connections").WithOccurrence(2).WithStartupTimeout(5*time.Second),
		),
	)
	if err != nil {
		return nil, err
	}

	// Dynamically create DB configuration
	hostPort, err := pgContainer.Endpoint(ctx, "")
	if err != nil {
		return nil, err
	}
	host := strings.Split(hostPort, ":")[0]
	port := strings.Split(hostPort, ":")[1]

	dbCfg := &config.DB{
		Host:     host,
		Port:     port,
		User:     "username",
		Password: "password",
		Name:     "test",
		SSLmode:  "disable",
	}

	return &PostgresContainer{
		PostgresContainer: pgContainer,
		DBCfg:             dbCfg,
	}, nil
}
