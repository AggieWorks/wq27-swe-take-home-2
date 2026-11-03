package middleware

import (
	gin_adapter "github.com/39george/scs_gin_adapter"
	"github.com/aggieworks/dibs/internal/config"
	"github.com/aggieworks/dibs/internal/core/port"
	"github.com/gin-gonic/gin"
)

type Middleware interface {
	AuthMiddleware() gin.HandlerFunc
	LaxAuthMiddleware() gin.HandlerFunc
	AdminAccess() gin.HandlerFunc
	CORS() gin.HandlerFunc
}

type MiddlewareService struct {
	cfg      *config.Config
	sm       *gin_adapter.GinAdapter
	userRepo port.UserRepository
	tokenSvc port.TokenService
	authSvc  port.AuthService
}

// NewMiddlewareService creates a new instance of MiddlewareService.
func NewMiddlewareService(cfg *config.Config, sm *gin_adapter.GinAdapter, userRepo port.UserRepository, tokenService port.TokenService, authSvc port.AuthService) *MiddlewareService {
	return &MiddlewareService{
		cfg:      cfg,
		sm:       sm,
		userRepo: userRepo,
		tokenSvc: tokenService,
		authSvc:  authSvc,
	}
}
