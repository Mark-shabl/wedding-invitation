// Package main Wedding Invitations API
//
// @title Wedding Invitations API
// @version 1.0
// @description API for wedding invitations and RSVP management
// @host localhost:8080
// @BasePath /api/v1
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"wedding-invites/backend/internal/cache"
	"wedding-invites/backend/internal/config"
	"wedding-invites/backend/internal/database"
	"wedding-invites/backend/internal/handler"
	"wedding-invites/backend/internal/middleware"
	"wedding-invites/backend/internal/service"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"go.uber.org/zap"

	_ "wedding-invites/backend/docs"
)

func main() {
	logger, _ := zap.NewProduction()
	defer logger.Sync()

	cfg, err := config.Load()
	if err != nil {
		logger.Fatal("load config", zap.Error(err))
	}

	db, err := database.Connect(cfg.DBDSN)
	if err != nil {
		logger.Fatal("connect db", zap.Error(err))
	}
	if err := database.Migrate(db); err != nil {
		logger.Fatal("migrate", zap.Error(err))
	}
	if err := database.Seed(db, cfg); err != nil {
		logger.Fatal("seed", zap.Error(err))
	}

	redisCache, err := cache.New(cfg.RedisURL)
	if err != nil {
		logger.Fatal("connect redis", zap.Error(err))
	}
	defer redisCache.Close()

	svc := service.New(db, redisCache, cfg)
	h := handler.New(svc, cfg.UploadDir)

	if os.Getenv("GIN_MODE") != "debug" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(middleware.ZapLogger(logger))
	r.Use(middleware.Prometheus())

	r.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.CORSOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.GET("/metrics", gin.WrapH(promhttp.Handler()))
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	limiter := middleware.NewRedisRateLimiter(redisCache.Client(), cfg.RateLimitRPS)
	rl := handler.RateLimiters{
		Login: limiter.Middleware("login"),
		RSVP:  limiter.Middleware("rsvp"),
	}
	handler.RegisterRoutes(r, h, svc, rl)

	srv := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: r,
	}

	go func() {
		logger.Info("server starting", zap.String("port", cfg.Port))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal("listen", zap.Error(err))
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	logger.Info("shutting down")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		logger.Fatal("shutdown", zap.Error(err))
	}
	fmt.Println("server stopped")
}
