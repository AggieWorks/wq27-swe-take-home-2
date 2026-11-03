package service

import (
	"context"

	"github.com/aggieworks/dibs/internal/core/model"
	"github.com/aggieworks/dibs/internal/core/port"
)

// BusinessService implements port.BusinessService interface with access to business repository.
type BusinessService struct {
	repo port.BusinessRepository
}

// NewBusinessService creates a new instance of BusinessService.
func NewBusinessService(repo port.BusinessRepository) *BusinessService {
	return &BusinessService{
		repo: repo,
	}
}

// GetAllBusinesses retrieves all businesses from the repository.
func (s *BusinessService) GetAllBusinesses(ctx context.Context) ([]model.Business, error) {
	return s.repo.GetAllBusinesses(ctx)
}

// GetBusinessById retrieves a business from the repository based on the ID.
func (s *BusinessService) GetBusinessById(ctx context.Context, id string) (*model.Business, error) {
	return s.repo.GetBusinessById(ctx, id)
}

// GetBusinessByName retrieves a business from the repository based on the name.
func (s *BusinessService) GetBusinessByName(ctx context.Context, name string) (*model.Business, error) {
	return s.repo.GetBusinessByName(ctx, name)
}

// CreateBusiness creates a new business in the repository.
func (s *BusinessService) CreateBusiness(ctx context.Context, business *model.Business) (*model.Business, error) {
	return s.repo.CreateBusiness(ctx, business)
}

// UpdateBusiness updates the business by ID in the repository.
func (s *BusinessService) UpdateBusiness(ctx context.Context, business *model.Business) (*model.Business, error) {
	return s.repo.UpdateBusiness(ctx, business)
}

// DeleteBusinessById deletes a business by ID in the repository.
func (s *BusinessService) DeleteBusinessById(ctx context.Context, id string) error {
	return s.repo.DeleteBusinessById(ctx, id)
}

// GetBusinessByCusineType retrieves a business from the repository based on the cusine type
func (s *BusinessService) GetBusinessByCusineType(ctx context.Context, cusineType string) ([]model.Business, error) {
	return s.repo.GetBusinessByCusineType(ctx, cusineType)
}
