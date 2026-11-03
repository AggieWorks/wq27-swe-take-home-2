package handler

import (
	"net/http"

	"github.com/aggieworks/dibs/internal/config"
	"github.com/aggieworks/dibs/internal/core/port"
	"github.com/gin-gonic/gin"
)

type PresignedUrlHandler struct {
	cfg   *config.Config
	s3Svc port.S3Service
}

func NewPresignedURLHandler(cfg *config.Config, s3Svc port.S3Service) *PresignedUrlHandler {
	return &PresignedUrlHandler{
		cfg:   cfg,
		s3Svc: s3Svc,
	}
}

// GeneratePresignedUrl returns upload targets for local storage in the take-home setup.
func (h *PresignedUrlHandler) GeneratePresignedUrl(ctx *gin.Context) {
	// Get key from request body
	var requestBody struct {
		Key string `json:"key" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&requestBody); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	key := requestBody.Key

	// Get presigned URL from S3 service
	presignedUrl, uploadedUrl, err := h.s3Svc.GeneratePresignedUrl(ctx, key)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve presigned URL"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"presignedUrl": presignedUrl, "uploadedUrl": uploadedUrl})
}
