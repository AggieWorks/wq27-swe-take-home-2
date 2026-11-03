package repository

import (
	"context"
	"testing"

	"github.com/aggieworks/dibs/internal/adapter/store/postgres"
	"github.com/aggieworks/dibs/internal/core/utils/testhelpers"
	"github.com/stretchr/testify/assert"
)

// TestNewUserRepository tests the NewUserRepository method.
func TestNewUserRepository(t *testing.T) {
	ctx := context.Background()

	pgContainer, err := testhelpers.CreateTestPostgresContainer(ctx)
	assert.NoError(t, err)

	db := postgres.NewPostgres(pgContainer.DBCfg)

	repo := NewUserRepository(db)
	assert.NotNil(t, repo)
	assert.NotNil(t, repo.db)
}
