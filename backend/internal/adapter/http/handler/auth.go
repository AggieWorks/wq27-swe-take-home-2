package handler

import (
	"net/http"

	gin_adapter "github.com/39george/scs_gin_adapter"
	"github.com/aggieworks/dibs/internal/config"
	"github.com/aggieworks/dibs/internal/core/port"
	"github.com/aggieworks/dibs/internal/core/utils"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	cfg     *config.Config
	sm      *gin_adapter.GinAdapter
	authSvc port.AuthService
}

// NewAuthHandler creates a new instance of AuthHandler for handling authentication requests.
func NewAuthHandler(cfg *config.Config, sm *gin_adapter.GinAdapter, authSvc port.AuthService) *AuthHandler {
	return &AuthHandler{
		cfg:     cfg,
		sm:      sm,
		authSvc: authSvc,
	}
}

// SignInWithProvider handles the request to sign in with a provider.
func (h *AuthHandler) SignInWithProvider(c *gin.Context) {
	err := h.sm.RenewToken(c)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
	}
	provider := c.Param("provider") // The :provider from the request url
	query := c.Request.URL.Query()
	query.Add("provider", provider)
	c.Request.URL.RawQuery = query.Encode()

	h.authSvc.SignInWithProvider(c.Writer, c.Request)
}

// CallbackHandler handles the callback from the provider after signing in.
func (h *AuthHandler) CallbackHandler(c *gin.Context) {
	provider := c.Param("provider")
	query := c.Request.URL.Query()
	query.Add("provider", provider)
	c.Request.URL.RawQuery = query.Encode()

	// Get user from provider
	user, err := h.authSvc.CallbackHandler(c.Writer, c.Request)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
	}

	// Set user in session
	h.sm.Put(c, "user", user)

	c.Redirect(http.StatusTemporaryRedirect, utils.GetEnvAsString("FRONTEND_URL", ""))
}

// LogOut handles the request to sign out.
func (h *AuthHandler) LogOut(c *gin.Context) {
	err := h.sm.RenewToken(c)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
	}
	h.sm.Destroy(c)
	c.JSON(http.StatusOK, gin.H{"message": "Successfully signed out"})
}
