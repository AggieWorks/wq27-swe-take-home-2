package http

import (
	gin_adapter "github.com/39george/scs_gin_adapter"
	"github.com/aggieworks/dibs/internal/adapter/http/handler"
	"github.com/aggieworks/dibs/internal/adapter/http/middleware"
	"github.com/aggieworks/dibs/internal/adapter/store/localupload"
	"github.com/aggieworks/dibs/internal/config"
	"github.com/gin-gonic/gin"
)

// Router is a wrapper for HTTP router.
type Router struct {
	*gin.Engine
}

// NewRouter creates a new HTTP router.
func NewRouter(
	cfg *config.Config,
	sessionAdapter *gin_adapter.GinAdapter,
	presignedUrlHandler *handler.PresignedUrlHandler,
	userHandler *handler.UserHandler,
	businessHandler *handler.BusinessHandler,
	businessHourHandler *handler.BusinessHourHandler,
	dealHandler *handler.DealHandler,
	authHandler *handler.AuthHandler,
	middleware *middleware.MiddlewareService,
	predictCuisineHandler *handler.PredictCuisineHandler,
	localUploadHandler *handler.LocalUploadHandler,
	localStorage *localupload.LocalStorage,
) *Router {
	// Set to release mode if not development
	if cfg.App.Env != "development" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()

	// Use session adapter to manage authenticated sessions
	router.Use(sessionAdapter.LoadAndSave)

	// Enable CORS
	router.Use(middleware.CORS())

	// Local image uploads (take-home; replaces cloud object storage)
	router.Static("/uploads", localStorage.UploadDir())

	// Handler groups
	apiGroup := router.Group("api")
	{
		businessGroup := apiGroup.Group("/business")
		{
			businessGroup.GET("", businessHandler.ListBusinesses)
			businessGroup.GET(":id", businessHandler.GetBusinessByID)
			businessGroup.GET("name/:name", businessHandler.GetBusinessByName)
			businessGroup.POST("", businessHandler.CreateBusiness)
			businessGroup.PUT(":id", businessHandler.UpdateBusinessByID)
			businessGroup.DELETE(":id", businessHandler.DeleteBusinessByID)
		}
		// businessHourGroup := apiGroup.Group("/business_hour")
		// {
		// 	businessHourGroup.POST("", businessHourHandler.CreateBusinessHour)
		// 	businessHourGroup.PUT(":id", businessHourHandler.UpdateBusinessHourById)
		// 	businessHourGroup.DELETE(":id", businessHourHandler.DeleteBusinessHourById)
		// }
		dealGroup := apiGroup.Group("/deal")
		{
			dealGroup.GET("", dealHandler.ListDeals)
			dealGroup.GET(":id", dealHandler.GetDealByID)
			dealGroup.GET("user/:userId", dealHandler.GetDealsByUserID)
			dealGroup.POST("", middleware.AuthMiddleware(), dealHandler.CreateDeal)
			dealGroup.PUT(":id", middleware.AuthMiddleware(), dealHandler.UpdateDealByID)
			dealGroup.DELETE(":id", middleware.AuthMiddleware(), dealHandler.DeleteDealByID)
			likeGroup := dealGroup.Group("/like")
			{
				likeGroup.GET(":id", middleware.LaxAuthMiddleware(), dealHandler.GetDealLikeInformation)
				likeGroup.POST(":id", middleware.AuthMiddleware(), dealHandler.LikeDeal)
				likeGroup.DELETE(":id", middleware.AuthMiddleware(), dealHandler.UnlikeDeal)
			}
		}
		userGroup := apiGroup.Group("/user")
		{
			userGroup.GET("", middleware.AuthMiddleware(), userHandler.GetUser)
			userGroup.GET(":id", userHandler.GetUserByID)
			userGroup.PUT("", middleware.AuthMiddleware(), userHandler.UpdateUser)
		}
		// SMS subscription (optional; not required for take-home)
		// subscribeGroup := apiGroup.Group("/subscribe")
		// {
		// 	subscribeGroup.PUT("", func(ctx *gin.Context) {
		// 		userHandler.SubOrUnsubUser(ctx, true)
		// 	})
		// }
		// unsubscribeGroup := apiGroup.Group("/unsubscribe")
		// {
		// 	unsubscribeGroup.PUT("", func(ctx *gin.Context) {
		// 		userHandler.SubOrUnsubUser(ctx, false)
		// 	})
		// }
		apiGroup.PUT("/local-upload/*objectKey", localUploadHandler.Upload)
		presignedURLGroup := apiGroup.Group("/presigned-url")
		{
			presignedURLGroup.POST("", presignedUrlHandler.GeneratePresignedUrl)
		}
		authGroup := apiGroup.Group("/auth")
		{
			authGroup.GET(":provider", authHandler.SignInWithProvider)
			authGroup.GET(":provider/callback", authHandler.CallbackHandler)
			authGroup.POST("logout", authHandler.LogOut)
		}
		// Optional stub endpoint (no external AI in take-home)
		predictCuisineGroup := apiGroup.Group("/predict-cuisine")
		{
			predictCuisineGroup.POST("", predictCuisineHandler.PredictCuisine)
		}
	}

	return &Router{
		router,
	}
}

// Serve starts the HTTP server.
func (r *Router) Serve(listenAddr string) error {
	return r.Run(listenAddr)
}
