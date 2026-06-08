package handler

import (
	"errors"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"wedding-invites/backend/internal/dto"
	"wedding-invites/backend/internal/models"
	"wedding-invites/backend/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Handler struct {
	svc       *service.Service
	uploadDir string
}

func New(svc *service.Service, uploadDir string) *Handler {
	return &Handler{svc: svc, uploadDir: uploadDir}
}

func (h *Handler) Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func (h *Handler) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: err.Error()})
		return
	}
	resp, err := h.svc.Login(req.Username, req.Password)
	if err != nil {
		if errors.Is(err, service.ErrInvalidCreds) {
			c.JSON(http.StatusUnauthorized, dto.ErrorResponse{Error: "invalid credentials"})
			return
		}
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *Handler) GetInvitation(c *gin.Context) {
	token := c.Param("token")
	resp, err := h.svc.GetInvitation(c.Request.Context(), token)
	if err != nil {
		if errors.Is(err, service.ErrNotFound) {
			c.JSON(http.StatusNotFound, dto.ErrorResponse{Error: "invitation not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *Handler) SubmitRSVP(c *gin.Context) {
	token := c.Param("token")
	var req dto.SubmitRSVPRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: err.Error()})
		return
	}
	resp, err := h.svc.SubmitRSVP(c.Request.Context(), token, req)
	if err != nil {
		if errors.Is(err, service.ErrNotFound) {
			c.JSON(http.StatusNotFound, dto.ErrorResponse{Error: "invitation not found"})
			return
		}
		if errors.Is(err, service.ErrRSVPExists) {
			c.JSON(http.StatusConflict, dto.ErrorResponse{Error: "rsvp already submitted"})
			return
		}
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusCreated, resp)
}

func (h *Handler) GetSettings(c *gin.Context) {
	settings, err := h.svc.GetSettings(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, serviceToSettingsDTO(settings))
}

func (h *Handler) UpdateSettings(c *gin.Context) {
	var req dto.WeddingSettingsDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: err.Error()})
		return
	}
	settings, err := h.svc.UpdateSettings(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, serviceToSettingsDTO(settings))
}

func (h *Handler) ListProgram(c *gin.Context) {
	items, err := h.svc.ListProgram()
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
		return
	}
	out := make([]dto.ProgramItemDTO, len(items))
	for i, item := range items {
		out[i] = dto.ProgramItemDTO{ID: item.ID, Time: item.Time, Title: item.Title, SortOrder: item.SortOrder}
	}
	c.JSON(http.StatusOK, out)
}

func (h *Handler) CreateProgram(c *gin.Context) {
	var req dto.ProgramItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: err.Error()})
		return
	}
	item, err := h.svc.CreateProgramItem(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusCreated, item)
}

func (h *Handler) UpdateProgram(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	var req dto.ProgramItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: err.Error()})
		return
	}
	item, err := h.svc.UpdateProgramItem(uint(id), req)
	if err != nil {
		if errors.Is(err, service.ErrNotFound) {
			c.JSON(http.StatusNotFound, dto.ErrorResponse{Error: "not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, item)
}

func (h *Handler) DeleteProgram(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	if err := h.svc.DeleteProgramItem(uint(id)); err != nil {
		if errors.Is(err, service.ErrNotFound) {
			c.JSON(http.StatusNotFound, dto.ErrorResponse{Error: "not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *Handler) ListFAQ(c *gin.Context) {
	items, err := h.svc.ListFAQ()
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
		return
	}
	out := make([]dto.FAQItemDTO, len(items))
	for i, item := range items {
		out[i] = dto.FAQItemDTO{ID: item.ID, Question: item.Question, Answer: item.Answer, SortOrder: item.SortOrder}
	}
	c.JSON(http.StatusOK, out)
}

func (h *Handler) CreateFAQ(c *gin.Context) {
	var req dto.FAQItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: err.Error()})
		return
	}
	item, err := h.svc.CreateFAQItem(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusCreated, item)
}

func (h *Handler) UpdateFAQ(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	var req dto.FAQItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: err.Error()})
		return
	}
	item, err := h.svc.UpdateFAQItem(uint(id), req)
	if err != nil {
		if errors.Is(err, service.ErrNotFound) {
			c.JSON(http.StatusNotFound, dto.ErrorResponse{Error: "not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, item)
}

func (h *Handler) DeleteFAQ(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	if err := h.svc.DeleteFAQItem(uint(id)); err != nil {
		if errors.Is(err, service.ErrNotFound) {
			c.JSON(http.StatusNotFound, dto.ErrorResponse{Error: "not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *Handler) ListGuests(c *gin.Context) {
	guests, err := h.svc.ListGuests()
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
		return
	}
	out := make([]dto.GuestDTO, len(guests))
	for i, g := range guests {
		out[i] = service.ToGuestDTO(g, h.svc.PublicURL())
	}
	c.JSON(http.StatusOK, out)
}

func (h *Handler) CreateGuest(c *gin.Context) {
	var req dto.CreateGuestRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: err.Error()})
		return
	}
	guest, err := h.svc.CreateGuest(req.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusCreated, service.ToGuestDTO(*guest, h.svc.PublicURL()))
}

func (h *Handler) DeleteGuest(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)
	if err := h.svc.DeleteGuest(uint(id)); err != nil {
		if errors.Is(err, service.ErrNotFound) {
			c.JSON(http.StatusNotFound, dto.ErrorResponse{Error: "not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *Handler) ListRSVPs(c *gin.Context) {
	filter := c.Query("filter")
	items, err := h.svc.ListRSVPs(filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, items)
}

func (h *Handler) Dashboard(c *gin.Context) {
	stats, err := h.svc.DashboardStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, stats)
}

func (h *Handler) Upload(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: "file required"})
		return
	}
	ext := strings.ToLower(filepath.Ext(file.Filename))
	switch ext {
	case ".jpg", ".jpeg", ".png", ".webp":
	default:
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: "invalid file type"})
		return
	}
	if err := os.MkdirAll(h.uploadDir, 0o755); err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
		return
	}
	name := uuid.New().String() + ext
	dest := filepath.Join(h.uploadDir, name)
	if err := c.SaveUploadedFile(file, dest); err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, dto.UploadResponse{URL: "/uploads/" + name})
}

func serviceToSettingsDTO(s *models.WeddingSettings) dto.WeddingSettingsDTO {
	return dto.WeddingSettingsDTO{
		GroomName:      s.GroomName,
		BrideName:      s.BrideName,
		WeddingDate:    s.WeddingDate,
		HeroPhotoURL:   s.HeroPhotoURL,
		WelcomeText:    s.WelcomeText,
		VenueName:      s.VenueName,
		VenueAddress:   s.VenueAddress,
		YandexMapURL:   s.YandexMapURL,
		DressCodeText:  s.DressCodeText,
		FooterText:     s.FooterText,
		AccentColor:    s.AccentColor,
		SecondaryColor: s.SecondaryColor,
	}
}
