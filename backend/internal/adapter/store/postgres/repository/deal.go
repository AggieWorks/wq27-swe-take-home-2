package repository

import (
	"context"
	"errors"

	"github.com/aggieworks/dibs/internal/core/model"
	"gorm.io/gorm"
)

// DealRepository implements port.DealRepository interface with access to Postgres instance.
type DealRepository struct {
	db *gorm.DB
}

// NewDealRepository creates a new DealRepository instance.
func NewDealRepository(db *gorm.DB) *DealRepository {
	return &DealRepository{
		db: db,
	}
}

// GetAllDeals selects all deals from the database.
func (r *DealRepository) GetAllDeals(ctx context.Context) ([]model.Deal, error) {
	deals := []model.Deal{}

	result := r.db.Preload("Business").Find(&deals)
	if result.Error != nil {
		return nil, result.Error
	}

	return deals, nil
}

// GetDealById selects a deal from the database based on the ID.
func (r *DealRepository) GetDealById(ctx context.Context, id string) (*model.Deal, error) {
	var deal model.Deal

	result := r.db.Preload("Business").Where("id = ?", id).First(&deal)
	if result.Error != nil {
		return nil, result.Error
	}

	return &deal, nil
}

// GetDealsByUserId selects all deals from the database based on the user ID.
func (r *DealRepository) GetDealsByUserId(ctx context.Context, userId string) ([]model.Deal, error) {
	// Initialize a slice to store deals
	deals := []model.Deal{}

	// Retrieve all deals for the given user ID from the database
	if err := r.db.Preload("Business").Where("user_id = ?", userId).Find(&deals).Error; err != nil {
		return []model.Deal{}, err
	}

	// If no deals found, return empty array rather than null
	if len(deals) == 0 {
		return []model.Deal{}, errors.New("no deals found")
	}

	return deals, nil
}

// GetDealsBySearchTerm selects all deals from the database based on the search term.
func (r *DealRepository) GetDealsBySearchTerm(ctx context.Context, searchTerm string) ([]model.Deal, error) {
	// Initialize a slice to store deals
	deals := []model.Deal{}

	// Retrieve all deals for the given search term from the database
	if err := r.db.Preload("Business").
		Joins("JOIN business ON business.id = deal.business_id").
		Where("deal.name ILIKE ? OR deal.description ILIKE ? OR deal.redeem_instructions ILIKE ? OR business.name ILIKE ?",
			"%"+searchTerm+"%", "%"+searchTerm+"%", "%"+searchTerm+"%", "%"+searchTerm+"%").
		Find(&deals).Error; err != nil {
		return []model.Deal{}, err
	}

	// If no deals found, return empty array rather than null
	if len(deals) == 0 {
		return []model.Deal{}, errors.New("no deals found")
	}

	return deals, nil
}

// CreateDeal creates a new deal in the database.
func (r *DealRepository) CreateDeal(ctx context.Context, deal *model.Deal) (*model.Deal, error) {
	// Start a transaction
	tx := r.db.Begin()
	if tx.Error != nil {
		return nil, tx.Error
	}

	// Create the deal
	if err := tx.Create(deal).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Reload the deal with business data
	var createdDeal model.Deal
	if err := tx.Preload("Business").Where("id = ?", deal.Id).First(&createdDeal).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		return nil, err
	}

	return &createdDeal, nil
}

// UpdateDeal updates the deal by ID in the database.
func (r *DealRepository) UpdateDeal(ctx context.Context, deal *model.Deal) (*model.Deal, error) {
	// Save the updated deal
	result := r.db.Save(deal)

	if result.Error != nil {
		return nil, result.Error
	}

	return deal, nil
}

// DeleteDealById deletes the deal by ID in the database.
func (r *DealRepository) DeleteDealById(ctx context.Context, id string) error {
	// Check if deal exists
	deal := model.Deal{}
	result := r.db.Where("id = ?", id).First(&deal)
	if result.Error != nil {
		return result.Error
	}

	// Delete the deal
	result = r.db.Delete(&deal)
	if result.Error != nil {
		return result.Error
	}

	return nil
}
