/*
The main package serves as the entry point for the application.

It initializes the necessary components, such as the database connection and HTTP router,
and starts the web server. The Gin framework is used to handle HTTP routing and requests.
*/
package main

import (
	"encoding/gob"
	"time"

	_ "golang.org/x/crypto/x509roots/fallback"

	gin_adapter "github.com/39george/scs_gin_adapter"
	"github.com/aggieworks/dibs/internal/adapter/auth/jwt"
	"github.com/aggieworks/dibs/internal/adapter/auth/oauth"
	"github.com/aggieworks/dibs/internal/adapter/gemini"
	"github.com/aggieworks/dibs/internal/adapter/http"
	"github.com/aggieworks/dibs/internal/adapter/http/handler"
	"github.com/aggieworks/dibs/internal/adapter/http/middleware"
	"github.com/aggieworks/dibs/internal/adapter/store/localupload"
	"github.com/aggieworks/dibs/internal/adapter/store/postgres"
	"github.com/aggieworks/dibs/internal/adapter/store/postgres/repository"
	"github.com/aggieworks/dibs/internal/config"
	"github.com/aggieworks/dibs/internal/core/model"
	"github.com/aggieworks/dibs/internal/core/service"
	"github.com/aggieworks/dibs/internal/core/utils"
	"github.com/alexedwards/scs/v2"
)

/*
The main function is the entry point of the application.
*/
func main() {
	// Initialize configuration settings from environment variables
	appCfg := &config.App{
		Env: utils.GetEnvAsString("APP_ENV", "development"),
	}
	httpCfg := &config.HTTP{
		Host:      "",
		Port:      "8080",
		JWTSecret: utils.GetEnvAsString("JWT_SECRET", "local-dev-secret"),
	}
	dbCfg := &config.DB{
		Host:     utils.GetEnvAsString("POSTGRES_HOST", "localhost"),
		Port:     utils.GetEnvAsString("POSTGRES_PORT", "5432"),
		User:     utils.GetEnvAsString("POSTGRES_USER", "user"),
		Password: utils.GetEnvAsString("POSTGRES_PASSWORD", "password"),
		Name:     utils.GetEnvAsString("POSTGRES_DB", "dbname"),
		SSLmode:  utils.GetEnvAsString("POSTGRES_SSLMODE", "disable"),
	}
	authCfg := &config.OAUTH{
		ID:       utils.GetEnvAsString("GAUTH_CLIENT_ID", ""),
		Secret:   utils.GetEnvAsString("GAUTH_CLIENT_SECRET", ""),
		Callback: utils.GetEnvAsString("GAUTH_CLIENT_CALLBACK_URL", ""),
	}

	cfg := config.New(appCfg, httpCfg, dbCfg, authCfg, nil)

	publicAPIURL := utils.GetEnvAsString("API_PUBLIC_URL", "http://localhost:8080")
	uploadDir := utils.GetEnvAsString("UPLOAD_DIR", "uploads")
	localStorage := localupload.NewLocalStorage(publicAPIURL, uploadDir)
	localUploadHandler := handler.NewLocalUploadHandler(uploadDir)

	// Initialize the database connection, JWT service, and repositories
	db := postgres.NewPostgres(dbCfg)

	// Legacy account system
	jwtService := jwt.NewJWTService(cfg.HTTP.JWTSecret)

	userRepository := repository.NewUserRepository(db)
	userService := service.NewUserService(userRepository)
	userHandler := handler.NewUserHandler(cfg, userService, jwtService)

	businessRepository := repository.NewBusinessRepository(db)
	businessService := service.NewBusinessService(businessRepository)
	businessHandler := handler.NewBusinessHandler(cfg, businessService)

	businessHourRepository := repository.NewBusinessHourRepository(db)
	businessHourService := service.NewBusinessHourService(businessHourRepository)
	businessHourHandler := handler.NewBusinessHourHandler(businessHourService)

	likeRepository := repository.NewLikeRepository(db)
	likeService := service.NewLikeService(likeRepository)

	dealRepository := repository.NewDealRepository(db)
	dealService := service.NewDealService(dealRepository)
	dealHandler := handler.NewDealHandler(cfg, dealService, likeService, businessService)

	predictCuisineHandler := handler.NewPredictCuisineHandler(gemini.NewNoopPredictor())

	// OAuth and session manager
	gob.Register(&model.User{}) // scs package uses gob to encode/decode session data, so we register the User struct so it can encode it in the session
	sessionManager := scs.New()
	sessionManager.Lifetime = 72 * time.Hour
	// Host-only session cookie for local take-home (no shared parent domain).
	sessionManager.Cookie.Secure = false
	sessionAdapter := gin_adapter.New(sessionManager)
	oauthService := oauth.NewOAuthService(cfg.OAUTH, cfg.App.Env, userService)
	authHandler := handler.NewAuthHandler(cfg, sessionAdapter, oauthService)

	presignedUrlHandler := handler.NewPresignedURLHandler(cfg, localStorage)

	// Middleware
	middlewareService := middleware.NewMiddlewareService(cfg, sessionAdapter, userRepository, jwtService, oauthService)

	// Start the HTTP server
	router := http.NewRouter(
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
	router.Serve(cfg.HTTP.Host + ":" + cfg.HTTP.Port)
}
