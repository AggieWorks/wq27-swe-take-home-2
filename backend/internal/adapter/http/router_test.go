package http

import (
	"context"
	"encoding/gob"
	"testing"
	"time"

	gin_adapter "github.com/39george/scs_gin_adapter"
	"github.com/aggieworks/dibs/internal/adapter/auth/jwt"
	"github.com/aggieworks/dibs/internal/adapter/auth/oauth"
	"github.com/aggieworks/dibs/internal/adapter/gemini"
	"github.com/aggieworks/dibs/internal/adapter/http/handler"
	"github.com/aggieworks/dibs/internal/adapter/http/middleware"
	"github.com/aggieworks/dibs/internal/adapter/store/localupload"
	"github.com/aggieworks/dibs/internal/adapter/store/postgres"
	"github.com/aggieworks/dibs/internal/adapter/store/postgres/repository"
	"github.com/aggieworks/dibs/internal/config"
	"github.com/aggieworks/dibs/internal/core/model"
	"github.com/aggieworks/dibs/internal/core/service"
	"github.com/aggieworks/dibs/internal/core/utils/testhelpers"
	"github.com/alexedwards/scs/v2"
	"github.com/stretchr/testify/assert"
)

// CreateTestRouter creates a new test Router instance containing all services and using a testcontainer instance of Postgres..
func CreateTestRouter(ctx context.Context) (*Router, error) {
	// Create configuration with test Postgres container
	pgContainer, err := testhelpers.CreateTestPostgresContainer(ctx)
	cfg := &config.Config{
		App: &config.App{
			Env: "production",
		},
		DB: pgContainer.DBCfg,
		HTTP: &config.HTTP{
			Host: "",
			Port: "8080",
		},
		OAUTH: &config.OAUTH{
			ID:       "id",
			Secret:   "secret",
			Callback: "callback",
		},
	}
	if err != nil {
		return nil, err
	}

	localStorage := localupload.NewLocalStorage("http://localhost:8080", "uploads")
	localUploadHandler := handler.NewLocalUploadHandler("uploads")

	// Create services
	jwtService := jwt.NewJWTService("secret")
	db := postgres.NewPostgres(cfg.DB)

	userRepo := repository.NewUserRepository(db)
	userService := service.NewUserService(userRepo)
	userHandler := handler.NewUserHandler(cfg, userService, jwtService)

	businessRepo := repository.NewBusinessRepository(db)
	businessService := service.NewBusinessService(businessRepo)
	businessHandler := handler.NewBusinessHandler(cfg, businessService)

	businessHourRepo := repository.NewBusinessHourRepository(db)
	businessHourService := service.NewBusinessHourService(businessHourRepo)
	businessHourHandler := handler.NewBusinessHourHandler(businessHourService)

	likeRepository := repository.NewLikeRepository(db)
	likeService := service.NewLikeService(likeRepository)

	dealRepository := repository.NewDealRepository(db)
	dealService := service.NewDealService(dealRepository)
	dealHandler := handler.NewDealHandler(cfg, dealService, likeService, businessService)

	predictCuisineHandler := handler.NewPredictCuisineHandler(gemini.NewNoopPredictor())

	gob.Register(&model.User{})
	sessionManager := scs.New()
	sessionManager.Lifetime = 24 * time.Hour
	sessionManager.Cookie.Secure = cfg.App.Env != "development"
	sessionAdapter := gin_adapter.New(sessionManager)
	oauthService := oauth.NewOAuthService(cfg.OAUTH, cfg.App.Env, userService)
	authHandler := handler.NewAuthHandler(cfg, sessionAdapter, oauthService)

	presignedUrlHandler := handler.NewPresignedURLHandler(cfg, localStorage)

	// Middleware
	middlewareService := middleware.NewMiddlewareService(cfg, sessionAdapter, userRepo, jwtService, oauthService)

	// Start the HTTP server
	router := NewRouter(
		cfg,
		sessionAdapter,
		presignedUrlHandler,
		userHandler,
		businessHandler,
		businessHourHandler,
		dealHandler,
		authHandler,
		middlewareService,
		predictCuisineHandler,
		localUploadHandler,
		localStorage,
	)
	return router, nil
}

// TestNewRouter tests NewRouter function by integrating necessary services.
func TestNewRouter(t *testing.T) {
	ctx := context.Background()
	router, err := CreateTestRouter(ctx)
	assert.NoError(t, err)
	assert.NotNil(t, router)
}
