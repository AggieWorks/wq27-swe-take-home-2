package middleware

import (
	"net/http"

	"github.com/aggieworks/dibs/internal/core/model"
	"github.com/gin-gonic/gin"
)

// AuthMiddleware verifies the JWT token from the cookie and checks user status in database
func (m *MiddlewareService) AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// Get user from session
		user, ok := m.sm.Get(ctx, "user").(*model.User)
		if !ok {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		// Check if user is in database
		user, err := m.userRepo.GetUserByIdAndEmail(ctx, user.Id.String(), user.Email)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		// Set user information in context for use in protected routes
		ctx.Set("user", user)
		ctx.Next()
	}
}

// LaxAuthMiddleware verifies the JWT token from the cookie and checks user status in database. Does not abort if user is not authenticated
func (m *MiddlewareService) LaxAuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// Get user from session
		user, ok := m.sm.Get(ctx, "user").(*model.User)
		if !ok {
			ctx.Next()
			return
		}

		// Check if user is in database
		user, err := m.userRepo.GetUserByIdAndEmail(ctx, user.Id.String(), user.Email)
		if err != nil {
			ctx.Next()
			return
		}

		// Set user information in context for use in protected routes
		ctx.Set("user", user)
		ctx.Next()
	}
}

// AdminAccess restricts routes so only users with admin role can access
func (m *MiddlewareService) AdminAccess() gin.HandlerFunc {
	return func(c *gin.Context) {
		if m.cfg.App.Env == "production" {
			if isAuthorized, exists := c.Get("authorized"); !exists || !isAuthorized.(bool) {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
				return
			}

			role, _ := c.Get("role")
			if role != "admin" {
				c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
				return
			}
		}

		c.Next()
	}
}
