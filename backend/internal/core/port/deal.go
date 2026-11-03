package port

import (
	"context"

	"github.com/aggieworks/dibs/internal/core/model"
)

// DealRepository defines the interface for deal-related data operations in the database.
type DealRepository interface {
	GetAllDeals(ctx context.Context) ([]model.Deal, error)
	GetDealById(ctx context.Context, id string) (*model.Deal, error)
	GetDealsByUserId(ctx context.Context, userId string) ([]model.Deal, error)
	GetDealsBySearchTerm(ctx context.Context, searchTerm string) ([]model.Deal, error)
	CreateDeal(ctx context.Context, deal *model.Deal) (*model.Deal, error)
	UpdateDeal(ctx context.Context, deal *model.Deal) (*model.Deal, error)
	DeleteDealById(ctx context.Context, id string) error
}

// DealService defines the interface for deal-related operations in the application.
type DealService interface {
	GetAllDeals(ctx context.Context) ([]model.Deal, error)
	GetDealById(ctx context.Context, id string) (*model.Deal, error)
	GetDealsByUserId(ctx context.Context, userId string) ([]model.Deal, error)
	GetDealsBySearchTerm(ctx context.Context, searchTerm string) ([]model.Deal, error)
	CreateDeal(ctx context.Context, deal *model.Deal) (*model.Deal, error)
	UpdateDeal(ctx context.Context, deal *model.Deal) (*model.Deal, error)
	DeleteDealById(ctx context.Context, id string) error
}
