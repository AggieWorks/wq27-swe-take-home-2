package handler

import (
	"log"
	"net/http"

	"github.com/aggieworks/dibs/internal/config"
	"github.com/aggieworks/dibs/internal/core/model"
	"github.com/aggieworks/dibs/internal/core/port"
	"github.com/aggieworks/dibs/internal/core/utils"
	"github.com/gin-gonic/gin"
)

// UserHandler handles HTTP requests related to user operations.
type UserHandler struct {
	cfg      *config.Config
	svc      port.UserService
	tokenSvc port.TokenService
}

// NewUserHandler creates a new UserHandler instance.
func NewUserHandler(cfg *config.Config, svc port.UserService, jwt port.TokenService) *UserHandler {
	return &UserHandler{
		cfg:      cfg,
		svc:      svc,
		tokenSvc: jwt,
	}
}

// GetUser retrieves user from service based on userId and phone from context.
func (h *UserHandler) GetUser(ctx *gin.Context) {
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

	ctx.JSON(http.StatusOK, &userModel)
}

// GetUserByID retrieves user info from service based on userID
// Used for viewing profiles.
func (h *UserHandler) GetUserByID(ctx *gin.Context) {
	userID := ctx.Param("id")

	user, err := h.svc.GetUserByID(ctx, userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user"})
		return
	}

	ctx.JSON(http.StatusOK, &user)
}

// UpdateUser updates the current user's info
// Does not take id as parameter, does by cookie to prevent API abuse
func (h *UserHandler) UpdateUser(ctx *gin.Context) {
	var userUpdate model.UserUpdate
	// Get user
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

	if err := ctx.ShouldBindJSON(&userUpdate); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userModel.Nickname = userUpdate.Nickname
	userModel.Phone = userUpdate.Phone

	// Update user in service
	updatedUser, err := h.svc.UpdateUser(ctx, userModel)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	ctx.JSON(http.StatusOK, &updatedUser)
}

// SubOrUnsubUser opts user in/out of SMS notifications with their phone number.
func (h *UserHandler) SubOrUnsubUser(ctx *gin.Context, isSubscribing bool) {
	if h.cfg.App.Env != "development" {
		// Check if the user is authorized
		authorized, exists := ctx.Get("authorized")
		if !exists || authorized == nil {
			authorized = false
		}

		// Type assert `authorized` to a boolean
		isAuthorized, valid := authorized.(bool)
		if !isSubscribing && (!valid || !isAuthorized) {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
	}

	var user model.User

	// Bind and validate the request body
	if err := ctx.ShouldBindJSON(&user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body or missing required fields.",
		})
		return
	}

	updatedUser, err := h.svc.SubOrUnsubUser(ctx, &user, isSubscribing)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to update subscription status.",
		})
		return
	}

	if !isSubscribing {
		// "Delete" cookie if user is unsubscribing
		ctx.SetCookie(
			"session",               // name
			"",                      // value
			-1,                      // maxAge (400 days in seconds)
			"/",                     // path
			"http://localhost:3000", // domain
			false,                   // secure (set to true if using HTTPS)
			true,                    // httpOnly
		)
	} else {
		// Create JWT token
		token, err := h.tokenSvc.GenerateToken(user.Id, user.Phone)
		if err != nil {
			log.Println("Error creating JWT:", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating session"})
			return
		}

		// Set the cookie with long expiration and persistent across browser sessions
		ctx.SetCookie(
			"session",                      // name
			token,                          // value
			60*60*24*utils.MAX_COOKIE_DAYS, // maxAge (400 days in seconds)
			"/",                            // path
			"",                             // domain
			false,                          // secure (set to true if using HTTPS)
			true,                           // httpOnly
		)
	}

	ctx.JSON(http.StatusOK, updatedUser)
}
