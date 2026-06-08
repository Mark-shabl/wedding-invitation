package handler

import (
	"wedding-invites/backend/internal/middleware"
	"wedding-invites/backend/internal/service"

	"github.com/gin-gonic/gin"
)

type RateLimiters struct {
	Login gin.HandlerFunc
	RSVP  gin.HandlerFunc
}

func RegisterRoutes(r *gin.Engine, h *Handler, svc *service.Service, rl RateLimiters) {
	r.GET("/health", h.Health)
	r.Static("/uploads", h.uploadDir)

	api := r.Group("/api/v1")
	{
		api.POST("/auth/login", rl.Login, h.Login)

		api.GET("/invite/:token", h.GetInvitation)
		api.POST("/invite/:token/rsvp", rl.RSVP, h.SubmitRSVP)

		admin := api.Group("/admin")
		admin.Use(middleware.JWTAuth(svc))
		{
			admin.GET("/dashboard", h.Dashboard)
			admin.GET("/settings", h.GetSettings)
			admin.PUT("/settings", h.UpdateSettings)
			admin.POST("/upload", h.Upload)

			admin.GET("/program", h.ListProgram)
			admin.POST("/program", h.CreateProgram)
			admin.PUT("/program/:id", h.UpdateProgram)
			admin.DELETE("/program/:id", h.DeleteProgram)

			admin.GET("/faq", h.ListFAQ)
			admin.POST("/faq", h.CreateFAQ)
			admin.PUT("/faq/:id", h.UpdateFAQ)
			admin.DELETE("/faq/:id", h.DeleteFAQ)

			admin.GET("/guests", h.ListGuests)
			admin.POST("/guests", h.CreateGuest)
			admin.DELETE("/guests/:id", h.DeleteGuest)

			admin.GET("/rsvps", h.ListRSVPs)
		}
	}
}
