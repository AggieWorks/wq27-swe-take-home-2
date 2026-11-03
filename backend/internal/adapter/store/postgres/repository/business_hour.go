package repository

import (
	"context"

	"github.com/aggieworks/dibs/internal/core/model"
	"gorm.io/gorm"
)

// BusinessHourRepository implements port.BusinessHourRepository interface with access to Postgres instance.
type BusinessHourRepository struct {
	db *gorm.DB
}

// NewBusinessHourRepository creates a new BusinessHourRepository instance.
func NewBusinessHourRepository(db *gorm.DB) *BusinessHourRepository {
	return &BusinessHourRepository{
		db: db,
	}
}

// CreateBusinessHour creates a new business hour in the database.
func (r *BusinessHourRepository) CreateBusinessHour(ctx context.Context, businessHour *model.BusinessHour) (*model.BusinessHour, error) {
	result := r.db.Create(businessHour)

	if result.Error != nil {
		return nil, result.Error
	}

	return businessHour, nil
}

// UpdateBusinessHour updates the business hour by ID in the database.
func (r *BusinessHourRepository) UpdateBusinessHour(ctx context.Context, businessHour *model.BusinessHour) (*model.BusinessHour, error) {
	// Save the updated business hour
	result := r.db.Save(businessHour)

	if result.Error != nil {
		return nil, result.Error
	}

	return businessHour, nil
}

// DeleteBusinessHourByID deletes a business hour by ID in the database.
func (r *BusinessHourRepository) DeleteBusinessHourByID(ctx context.Context, id string) error {
	// Check if business hour exists in the database
	var businessHour model.BusinessHour
	if err := r.db.Where("id = ?", id).First(&businessHour).Error; err != nil {
		return err
	}

	// Find and delete the business hour by ID
	if err := r.db.Where("id = ?", id).Delete(&model.BusinessHour{}).Error; err != nil {
		return err
	}

	return nil
}
