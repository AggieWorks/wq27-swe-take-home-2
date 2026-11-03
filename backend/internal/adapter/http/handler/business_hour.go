package handler

import (
	"net/http"

	"github.com/aggieworks/dibs/internal/core/model"
	"github.com/aggieworks/dibs/internal/core/port"
	"github.com/gin-gonic/gin"
)

// BusinessHourHandler handles HTTP requests related to business hour operations.
type BusinessHourHandler struct {
	svc port.BusinessHourService
}

// NewBusinessHourHandler creates a new BusinessHourHandler instance.
func NewBusinessHourHandler(svc port.BusinessHourService) *BusinessHourHandler {
	return &BusinessHourHandler{
		svc: svc,
	}
}

// CreateBusinessHour creates a new business hour in the service.
func (h *BusinessHourHandler) CreateBusinessHour(ctx *gin.Context) {
	var businessHour model.BusinessHour

	// Bind JSON payload to business hour model
	if err := ctx.ShouldBindJSON(&businessHour); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Create business hour in the service
	createdHours, err := h.svc.CreateBusinessHour(ctx, &businessHour)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to create business hour"})
		return
	}

	ctx.JSON(http.StatusCreated, createdHours)
}

// UpdateBusinessHourById updates a business hour in the service.
func (h *BusinessHourHandler) UpdateBusinessHourById(ctx *gin.Context) {
	var businessHour model.BusinessHour

	// Bind JSON payload to business hour model
	if err := ctx.ShouldBindJSON(&businessHour); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Update business hour in the service
	updatedHours, err := h.svc.UpdateBusinessHour(ctx, &businessHour)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update business hour"})
		return
	}

	ctx.JSON(http.StatusOK, updatedHours)
}

// DeleteBusinessHourById deletes a business hour in the service.
func (h *BusinessHourHandler) DeleteBusinessHourById(ctx *gin.Context) {
	id := ctx.Param("id")

	// Delete business hour in the service
	if err := h.svc.DeleteBusinessHourByID(ctx, id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete business hour"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Business hour deleted successfully"})
}
