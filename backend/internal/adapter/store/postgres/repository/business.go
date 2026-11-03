package repository

import (
	"context"

	"github.com/aggieworks/dibs/internal/core/model"
	"gorm.io/gorm"
)

// BusinessRepository implements port.BusinessRepository interface with access to Postgres instance.
type BusinessRepository struct {
	db *gorm.DB
}

// NewBusinessRepository creates a new BusinessRepository instance.
func NewBusinessRepository(db *gorm.DB) *BusinessRepository {
	return &BusinessRepository{
		db: db,
	}
}

// GetAllBusinesses selects all businesses from the database.
func (r *BusinessRepository) GetAllBusinesses(ctx context.Context) ([]model.Business, error) {
	businesses := []model.Business{}

	result := r.db.Preload("Hours").Find(&businesses)
	if result.Error != nil {
		return nil, result.Error
	}

	return businesses, nil
}

// GetBusinessById selects a business from the database based on the ID.
func (r *BusinessRepository) GetBusinessById(ctx context.Context, id string) (*model.Business, error) {
	var business model.Business

	result := r.db.Preload("Hours").Where("id = ?", id).First(&business)
	if result.Error != nil {
		return nil, result.Error
	}

	return &business, nil
}

// GetBusinessByName selects a business from the database based on the name.
func (r *BusinessRepository) GetBusinessByName(ctx context.Context, name string) (*model.Business, error) {
	var business model.Business

	result := r.db.Preload("Hours").Where("name = ?", name).First(&business)
	if result.Error != nil {
		return nil, result.Error
	}

	return &business, nil
}

// CreateBusiness creates a new business in the database.
func (r *BusinessRepository) CreateBusiness(ctx context.Context, business *model.Business) (*model.Business, error) {
	result := r.db.Create(business)

	if result.Error != nil {
		return nil, result.Error
	}

	return business, nil
}

// UpdateBusiness updates the business by ID in the database.
func (r *BusinessRepository) UpdateBusiness(ctx context.Context, business *model.Business) (*model.Business, error) {
	// Save the updated business
	result := r.db.Save(business)

	if result.Error != nil {
		return nil, result.Error
	}

	return business, nil
}

// DeleteBusiness deletes the business by ID from the database.
func (r *BusinessRepository) DeleteBusinessById(ctx context.Context, id string) error {
	// Check if business exists
	business := model.Business{}
	result := r.db.Where("id = ?", id).First(&business)
	if result.Error != nil {
		return result.Error
	}

	// Delete the business by ID
	result = r.db.Where("id = ?", id).Delete(&business)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

// GetBusinessByCusineType retrieves businesses that match a specific cuisine type
func (r *BusinessRepository) GetBusinessByCusineType(ctx context.Context, cusineType string) ([]model.Business, error) {
	var businesses []model.Business
	result := r.db.Find(&businesses)
	return businesses, result.Error
}
