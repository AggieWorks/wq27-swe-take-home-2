package handler

import (
	"net/http"

	"log"

	"github.com/aggieworks/dibs/internal/core/model"
	"github.com/aggieworks/dibs/internal/core/port"
	"github.com/gin-gonic/gin"
)

type CuisineRequest struct {
	Name string `json:"name" binding:"required"`
}

type PredictCuisineHandler struct {
	cuisinePredictor port.CuisinePredictor
}

func NewPredictCuisineHandler(cuisinePredictor port.CuisinePredictor) *PredictCuisineHandler {
	return &PredictCuisineHandler{cuisinePredictor: cuisinePredictor}
}

func (h *PredictCuisineHandler) PredictCuisine(ctx *gin.Context) {
	var req CuisineRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Printf("Invalid request: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	log.Printf("Received cuisine prediction request for business: %s", req.Name)

	// Create temporary business object with request data
	business := &model.Business{
		Name: req.Name,
	}

	// Call predictor to get cuisine types
	cuisineTypes, err := h.cuisinePredictor.PredictCuisine(ctx, business)
	if err != nil {
		log.Printf("ERROR in cuisine prediction: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to predict cuisine"})
		return
	}

	// Return cuisine types
	ctx.JSON(http.StatusOK, gin.H{
		"cuisineTypes": cuisineTypes,
	})
}
