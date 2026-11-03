package port

import (
	"context"

	"github.com/aggieworks/dibs/internal/core/model"
)

type CuisinePredictor interface {
	PredictCuisine(ctx context.Context, business *model.Business) ([]string, error)
}
