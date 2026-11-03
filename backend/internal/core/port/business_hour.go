package port

import (
	"context"

	"github.com/aggieworks/dibs/internal/core/model"
)

// BusinessHourRepository defines the interface for business-hour-related data operations in the database.
type BusinessHourRepository interface {
	CreateBusinessHour(ctx context.Context, businessHour *model.BusinessHour) (*model.BusinessHour, error)
	UpdateBusinessHour(ctx context.Context, businessHour *model.BusinessHour) (*model.BusinessHour, error)
	DeleteBusinessHourByID(ctx context.Context, id string) error
}

// BusinessHourService defines the interface for business-hour-related operations in the application.
type BusinessHourService interface {
	CreateBusinessHour(ctx context.Context, businessHour *model.BusinessHour) (*model.BusinessHour, error)
	UpdateBusinessHour(ctx context.Context, businessHour *model.BusinessHour) (*model.BusinessHour, error)
	DeleteBusinessHourByID(ctx context.Context, id string) error
}
