package postgres

import (
	"context"
	"fmt"
	"log"

	"github.com/aggieworks/dibs/internal/adapter/store/postgres/migrations"
	"github.com/aggieworks/dibs/internal/config"
	"github.com/pressly/goose/v3"
	"github.com/pressly/goose/v3/database"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

// NewPostgres creates a new *gorm.DB instance that connects to the specified Postgres instance.
func NewPostgres(dbCfg *config.DB) *gorm.DB {
	ctx := context.Background()
	dsn := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=%s",
		dbCfg.User,
		dbCfg.Password,
		dbCfg.Host,
		dbCfg.Port,
		dbCfg.Name,
		dbCfg.SSLmode,
	)

	// Attempt to connect to database
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		NamingStrategy: schema.NamingStrategy{
			SingularTable: true,
		},
	})
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}

	// Get the underlying *sql.DB object from GORM
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("Failed to get sql.DB from GORM: %v", err)
	}

	// Apply migrations using Goose
	provider, err := goose.NewProvider(database.DialectPostgres, sqlDB, migrations.Migrations)
	if err != nil {
		log.Fatalf("Failed to create Goose provider: %v", err)
	}

	// List status of migrations before applying them.
	stats, err := provider.Status(ctx)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("\n=== Migration Status ===")
	for _, s := range stats {
		log.Printf("%-3s %-2v %v\n", s.Source.Type, s.Source.Version, s.State)
	}

	log.Println("\n=== Log Migration Output  ===")
	results, err := provider.Up(ctx)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("\n=== Migration Results  ===")
	for _, r := range results {
		log.Printf("%-3s %-2v done: %v\n", r.Source.Type, r.Source.Version, r.Duration)
	}

	return db
}
