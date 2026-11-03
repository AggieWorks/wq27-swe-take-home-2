package service

import (
	"context"

	"github.com/aggieworks/dibs/internal/core/model"
	"github.com/aggieworks/dibs/internal/core/port"
)

// DealService implements port.DealService interface with access to deal repository.
type DealService struct {
	repo port.DealRepository
}

// NewDealService creates a new instance of DealService.
func NewDealService(repo port.DealRepository) *DealService {
	return &DealService{
		repo: repo,
	}
}

// GetAllDeals retrieves all deals from the repository.
func (s *DealService) GetAllDeals(ctx context.Context) ([]model.Deal, error) {
	return s.repo.GetAllDeals(ctx)
}

// GetDealById retrieves a deal from the repository based on the ID.
func (s *DealService) GetDealById(ctx context.Context, id string) (*model.Deal, error) {
	return s.repo.GetDealById(ctx, id)
}

// GetDealsByBusinessId retrieves all deals from the repository based on the user ID.
func (s *DealService) GetDealsByUserId(ctx context.Context, userId string) ([]model.Deal, error) {
	return s.repo.GetDealsByUserId(ctx, userId)
}

// GetDealsBySearchTerm retrieves all deals from the repository based on the search term.
func (s *DealService) GetDealsBySearchTerm(ctx context.Context, searchTerm string) ([]model.Deal, error) {
	return s.repo.GetDealsBySearchTerm(ctx, searchTerm)
}

// CreateDeal creates a new deal in the repository.
func (s *DealService) CreateDeal(ctx context.Context, deal *model.Deal) (*model.Deal, error) {
	return s.repo.CreateDeal(ctx, deal)
}

// UpdateDeal updates the deal by ID in the repository.
func (s *DealService) UpdateDeal(ctx context.Context, deal *model.Deal) (*model.Deal, error) {
	return s.repo.UpdateDeal(ctx, deal)
}

// DeleteDealById deletes a deal by ID in the repository.
func (s *DealService) DeleteDealById(ctx context.Context, id string) error {
	return s.repo.DeleteDealById(ctx, id)
}
