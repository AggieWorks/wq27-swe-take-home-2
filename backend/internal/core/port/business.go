package port

import (
	"context"

	"github.com/aggieworks/dibs/internal/core/model"
)

// BusinessRepository defines the interface for business-related data operations in the database.
type BusinessRepository interface {
	GetAllBusinesses(ctx context.Context) ([]model.Business, error)
	GetBusinessById(ctx context.Context, id string) (*model.Business, error)
	GetBusinessByName(ctx context.Context, name string) (*model.Business, error)
	CreateBusiness(ctx context.Context, business *model.Business) (*model.Business, error)
	UpdateBusiness(ctx context.Context, business *model.Business) (*model.Business, error)
	DeleteBusinessById(ctx context.Context, id string) error
	GetBusinessByCusineType(ctx context.Context, cusineType string) ([]model.Business, error)
}

// BusinessService defines the interface for business-related operations in the application.
type BusinessService interface {
	GetAllBusinesses(ctx context.Context) ([]model.Business, error)
	GetBusinessById(ctx context.Context, id string) (*model.Business, error)
	GetBusinessByName(ctx context.Context, name string) (*model.Business, error)
	CreateBusiness(ctx context.Context, business *model.Business) (*model.Business, error)
	UpdateBusiness(ctx context.Context, business *model.Business) (*model.Business, error)
	DeleteBusinessById(ctx context.Context, id string) error
	GetBusinessByCusineType(ctx context.Context, cusineType string) ([]model.Business, error)
}
