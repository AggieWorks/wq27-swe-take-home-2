package postgres

import (
	"context"
	"testing"

	"github.com/aggieworks/dibs/internal/core/utils/testhelpers"
	"github.com/stretchr/testify/assert"
	"github.com/testcontainers/testcontainers-go"
)

// TestNewPostgres tests the NewPostgres method for creating a new *gorm.DB instance.
func TestNewPostgres(t *testing.T) {
	ctx := context.Background()

	pgContainer, err := testhelpers.CreateTestPostgresContainer(ctx)
	defer func() {
		if err := testcontainers.TerminateContainer(pgContainer.PostgresContainer); err != nil {
			t.Error(err)
		}
	}()
	assert.NoError(t, err)

	db := NewPostgres(pgContainer.DBCfg)
	assert.NotNil(t, db)

	tables := []string{"user", "business", "deal", "business_hour"}
	for _, table := range tables {
		var exists bool
		err := db.Raw("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = ?)", table).Scan(&exists).Error
		assert.NoError(t, err)
		assert.True(t, exists, "Table %s does not exist", table)
	}
}
