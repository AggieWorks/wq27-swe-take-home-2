package middleware

import (
	"github.com/aggieworks/dibs/internal/core/utils"
	"github.com/gin-gonic/gin"
)

// CORS middleware for local take-home development (FRONTEND_URL must match the Next.js origin).
func (m *MiddlewareService) CORS() gin.HandlerFunc {
	allowedOrigin := utils.GetEnvAsString("FRONTEND_URL", "http://localhost:3000")

	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		if origin == allowedOrigin {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		}

		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
