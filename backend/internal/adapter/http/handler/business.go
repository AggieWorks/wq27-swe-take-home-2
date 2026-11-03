package handler

import (
	"net/http"

	"github.com/aggieworks/dibs/internal/config"
	"github.com/aggieworks/dibs/internal/core/model"
	"github.com/aggieworks/dibs/internal/core/port"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// BusinessHandler handles HTTP requests related to business operations.
type BusinessHandler struct {
	cfg *config.Config
	svc port.BusinessService
}

// NewBusinessHandler creates a new BusinessHandler instance.
func NewBusinessHandler(cfg *config.Config, svc port.BusinessService) *BusinessHandler {
	return &BusinessHandler{
		cfg: cfg,
		svc: svc,
	}
}

// ListBusinesses retrieves all businesses from service.
func (h *BusinessHandler) ListBusinesses(ctx *gin.Context) {
	// Get all businesses from service
	businesses, err := h.svc.GetAllBusinesses(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve businesses"})
		return
	}

	ctx.JSON(http.StatusOK, &businesses)
}

// GetBusinessByID retrieves a business from service based on ID.
func (h *BusinessHandler) GetBusinessByID(ctx *gin.Context) {
	// Get business from service based on ID
	business, err := h.svc.GetBusinessById(ctx, ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Business not found"})
		return
	}

	ctx.JSON(http.StatusOK, &business)
}

// GetBusinessByName retrieves a business from service based on name.
func (h *BusinessHandler) GetBusinessByName(ctx *gin.Context) {
	// Get business from service based on name
	business, err := h.svc.GetBusinessByName(ctx, ctx.Param("name"))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Business not found"})
		return
	}

	ctx.JSON(http.StatusOK, &business)
}

// CreateBusiness creates a new business in the service.
func (h *BusinessHandler) CreateBusiness(ctx *gin.Context) {
	var business model.Business

	if err := ctx.ShouldBindJSON(&business); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	createdBusiness, err := h.svc.CreateBusiness(ctx, &business)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create business"})
		return
	}

	ctx.JSON(http.StatusCreated, &createdBusiness)
}

// UpdateBusinessByID updates a business in the service based on ID.
func (h *BusinessHandler) UpdateBusinessByID(ctx *gin.Context) {
	// Check if business exists
	id := ctx.Param("id")
	_, err := h.svc.GetBusinessById(ctx, id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Business ID does not exist"})
		return
	}

	var business model.Business
	if err := ctx.ShouldBindJSON(&business); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	businessUUID, err := uuid.Parse(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid business ID format"})
		return
	}
	business.Id = businessUUID

	updatedBusiness, err := h.svc.UpdateBusiness(ctx, &business)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update business"})
		return
	}

	ctx.JSON(http.StatusOK, &updatedBusiness)
}

// DeleteBusinessByID deletes a business in the service based on ID.
func (h *BusinessHandler) DeleteBusinessByID(ctx *gin.Context) {
	err := h.svc.DeleteBusinessById(ctx, ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete business"})
		return
	}

	ctx.JSON(http.StatusOK, nil)
}

// GetBusinessByCusineType retrieves a business from service based on cusine type.
func (h *BusinessHandler) GetBusinessByCusineType(ctx *gin.Context) {
	cusineType := ctx.Param("cusineType")
	businesses, err := h.svc.GetBusinessByCusineType(ctx, cusineType)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve businesses"})
		return
	}

	ctx.JSON(http.StatusOK, &businesses)
}
