package service

import (
	"context"

	"github.com/aggieworks/dibs/internal/core/model"
	"github.com/aggieworks/dibs/internal/core/port"
)

// BusinessHourService implements port.BusinessHourService interface with access to business hour repository.
type BusinessHourService struct {
	repo port.BusinessHourRepository
}

// NewBusinessHourService creates a new instance of BusinessHourService.
func NewBusinessHourService(repo port.BusinessHourRepository) *BusinessHourService {
	return &BusinessHourService{
		repo: repo,
	}
}

// CreateBusinessHour creates a new business hour in the repository.
func (s *BusinessHourService) CreateBusinessHour(ctx context.Context, businessHour *model.BusinessHour) (*model.BusinessHour, error) {
	return s.repo.CreateBusinessHour(ctx, businessHour)
}

// UpdateBusinessHour updates the business hour by ID in the repository.
func (s *BusinessHourService) UpdateBusinessHour(ctx context.Context, businessHour *model.BusinessHour) (*model.BusinessHour, error) {
	return s.repo.UpdateBusinessHour(ctx, businessHour)
}

// DeleteBusinessHourByID deletes a business hour by ID in the repository.
func (s *BusinessHourService) DeleteBusinessHourByID(ctx context.Context, id string) error {
	return s.repo.DeleteBusinessHourByID(ctx, id)
}
