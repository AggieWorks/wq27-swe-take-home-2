package gemini

import (
	"context"

	"github.com/aggieworks/dibs/internal/core/model"
)

// NoopPredictor is used for the take-home repo (no Gemini API key required).
type NoopPredictor struct{}

func NewNoopPredictor() *NoopPredictor {
	return &NoopPredictor{}
}

func (p *NoopPredictor) PredictCuisine(_ context.Context, business *model.Business) ([]string, error) {
	if business != nil && business.CuisineType != "" {
		return []string{business.CuisineType}, nil
	}
	return []string{"Other"}, nil
}
