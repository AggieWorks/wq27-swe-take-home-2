package handler

import (
	"log"
	"net/http"
	"time"

	"github.com/aggieworks/dibs/internal/config"
	"github.com/aggieworks/dibs/internal/core/model"
	"github.com/aggieworks/dibs/internal/core/port"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// DealHandler handles HTTP requests related to deal operations.
type DealHandler struct {
	cfg         *config.Config
	dealSvc     port.DealService
	likeSvc     port.LikeService
	businessSvc port.BusinessService
}

// NewDealHandler creates a new DealHandler instance.
func NewDealHandler(cfg *config.Config, dealSvc port.DealService, likeSvc port.LikeService, businessSvc port.BusinessService) *DealHandler {
	return &DealHandler{
		cfg:         cfg,
		dealSvc:     dealSvc,
		likeSvc:     likeSvc,
		businessSvc: businessSvc,
	}
}

// ListDeals retrieves all deals from service.
func (h *DealHandler) ListDeals(ctx *gin.Context) {
	searchTerm := ctx.Query("search")
	var deals []model.Deal
	var err error

	// Get all deals from service depending on if search term is provided
	if searchTerm != "" {
		deals, err = h.dealSvc.GetDealsBySearchTerm(ctx, searchTerm)
	} else {
		deals, err = h.dealSvc.GetAllDeals(ctx)
	}

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve deals"})
		return
	}

	ctx.JSON(http.StatusOK, &deals)
}

// GetDealByID retrieves a deal from service based on ID.
func (h *DealHandler) GetDealByID(ctx *gin.Context) {
	// Get deal ID from request parameters
	id := ctx.Param("id")

	// Get deal from service
	deal, err := h.dealSvc.GetDealById(ctx, id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Deal not found"})
		return
	}

	ctx.JSON(http.StatusOK, &deal)
}

// GetDealsByUserID retrieves all deals from service based on the user ID.
func (h *DealHandler) GetDealsByUserID(ctx *gin.Context) {
	// Get all deals from service
	userId := ctx.Param("userId")
	deals, err := h.dealSvc.GetDealsByUserId(ctx, userId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve deals"})
		return
	}

	ctx.JSON(http.StatusOK, &deals)
}

// CreateDeal creates a new deal in the service.
func (h *DealHandler) CreateDeal(ctx *gin.Context) {
	var deal model.Deal

	// Bind JSON request body to deal model
	if err := ctx.ShouldBindJSON(&deal); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// First, try to find business by ID
	business, err := h.businessSvc.GetBusinessById(ctx, deal.BusinessId.String())
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid business ID"})
		return
	}

	// Set the business relationship for proper response
	deal.Business = business

	// Create deal in service
	createdDeal, err := h.dealSvc.CreateDeal(ctx, &deal)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create deal"})
		return
	}

	// Return the created deal with full business data
	ctx.JSON(http.StatusCreated, createdDeal)
}

// UpdateDealByID updates a deal in the service based on ID.
func (h *DealHandler) UpdateDealByID(ctx *gin.Context) {
	var deal model.Deal
	id := ctx.Param("id")

	// Check if deal exists
	origDeal, err := h.dealSvc.GetDealById(ctx, id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Deal not found"})
		return
	}

	// Bind JSON request body to deal model
	if err := ctx.ShouldBindJSON(&deal); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parse deal ID
	uuid, err := uuid.Parse(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid deal ID"})
		return
	}
	deal.Id = uuid

	// Keep the created date, verification status, and update the updated date
	deal.CreatedAt = origDeal.CreatedAt
	deal.IsVerified = origDeal.IsVerified // Preserve verification status on update
	deal.UpdatedAt = time.Now().UTC()

	// Update deal in service
	updatedDeal, err := h.dealSvc.UpdateDeal(ctx, &deal)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update deal"})
		return
	}

	ctx.JSON(http.StatusOK, &updatedDeal)
}

// DeleteDealByID deletes a deal in the service based on ID.
func (h *DealHandler) DeleteDealByID(ctx *gin.Context) {
	id := ctx.Param("id")

	// Get user from context
	user, ok := ctx.Get("user")
	if !ok {
		log.Println("User not found in context")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "User not found in context"})
		return
	}

	userModel, ok := user.(*model.User)
	if !ok {
		log.Println("Invalid user type")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user type"})
		return
	}

	// Check if deal exists and that user created it
	dealToDelete, err := h.dealSvc.GetDealById(ctx, id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Deal not found"})
		return
	}

	if userModel.Id != dealToDelete.UserId {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized to delete deal"})
		return
	}

	// Delete deal in service
	if err := h.dealSvc.DeleteDealById(ctx, id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete deal"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Deal deleted"})
}

// GetDealLikeInformation retrieves like information for a deal.
func (h *DealHandler) GetDealLikeInformation(ctx *gin.Context) {
	dealId := ctx.Param("id")

	// Check if deal exists
	if _, err := h.dealSvc.GetDealById(ctx, dealId); err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Deal not found"})
		return
	}

	// Get number of likes for deal
	numLikes, err := h.likeSvc.GetNumberOfLikesByDealId(ctx, dealId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve like information"})
		return
	}

	// Get if user liked deal
	user, ok := ctx.Get("user")
	if !ok {
		log.Println("User not found in context")
		ctx.JSON(http.StatusOK, gin.H{"numLikes": numLikes, "liked": false})
		return
	}

	userModel, ok := user.(*model.User)
	if !ok {
		log.Println("Invalid user type")
		ctx.JSON(http.StatusOK, gin.H{"numLikes": numLikes, "liked": false})
		return
	}

	liked := h.likeSvc.CheckUserLikedDeal(ctx, userModel.Id.String(), dealId)

	ctx.JSON(http.StatusOK, gin.H{"numLikes": numLikes, "liked": liked})
}

// LikeDeal adds a like to a deal in the service.
func (h *DealHandler) LikeDeal(ctx *gin.Context) {
	// Get userId and phone number from context
	user, ok := ctx.Get("user")
	if !ok {
		log.Println("User not found in context")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "User not found in context"})
		return
	}

	userModel, ok := user.(*model.User)
	if !ok {
		log.Println("Invalid user type")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user type"})
		return
	}

	// Get deal ID from request parameters
	dealId := ctx.Param("id")

	// Check if deal exists
	if _, err := h.dealSvc.GetDealById(ctx, dealId); err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Deal not found"})
		return
	}

	// Create a new Like model
	like := &model.Like{
		UserId: userModel.Id,
		DealId: uuid.MustParse(dealId),
	}

	// Like deal in service
	liked, err := h.likeSvc.LikeDeal(ctx, like)
	if err != nil {
		log.Printf("Failed to like deal: %v\n", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to like deal"})
		return
	}

	ctx.JSON(http.StatusOK, liked)
}

// UnlikeDeal removes a like from a deal in the service.
func (h *DealHandler) UnlikeDeal(ctx *gin.Context) {
	// Get userId and phone number from context
	user, ok := ctx.Get("user")
	if !ok {
		log.Println("User not found in context")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "User not found in context"})
		return
	}

	userModel, ok := user.(*model.User)
	if !ok {
		log.Println("Invalid user type")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user type"})
		return
	}

	// Get deal ID from request parameters
	dealId := ctx.Param("id")

	// Check if deal exists
	if _, err := h.dealSvc.GetDealById(ctx, dealId); err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Deal not found"})
		return
	}

	// Unlike deal in service
	if err := h.likeSvc.UnlikeDeal(ctx, userModel.Id.String(), dealId); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unlike deal"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Deal unliked"})
}
