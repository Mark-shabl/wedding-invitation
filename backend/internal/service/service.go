package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"wedding-invites/backend/internal/cache"
	"wedding-invites/backend/internal/config"
	"wedding-invites/backend/internal/dto"
	"wedding-invites/backend/internal/models"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var (
	ErrNotFound       = errors.New("not found")
	ErrInvalidCreds   = errors.New("invalid credentials")
	ErrRSVPExists     = errors.New("rsvp already submitted")
	ErrUnauthorized   = errors.New("unauthorized")
)

type Service struct {
	db     *gorm.DB
	cache  *cache.RedisCache
	cfg    *config.Config
}

func New(db *gorm.DB, c *cache.RedisCache, cfg *config.Config) *Service {
	return &Service{db: db, cache: c, cfg: cfg}
}

type jwtClaims struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func (s *Service) Login(username, password string) (*dto.LoginResponse, error) {
	var user models.AdminUser
	if err := s.db.Where("username = ?", username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrInvalidCreds
		}
		return nil, err
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, ErrInvalidCreds
	}

	expiresAt := time.Now().Add(s.cfg.JWTExpiry)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwtClaims{
		UserID:   user.ID,
		Username: user.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	})
	signed, err := token.SignedString([]byte(s.cfg.JWTSecret))
	if err != nil {
		return nil, err
	}
	return &dto.LoginResponse{
		AccessToken: signed,
		ExpiresIn:   int64(s.cfg.JWTExpiry.Seconds()),
	}, nil
}

func (s *Service) ValidateToken(tokenStr string) (*jwtClaims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &jwtClaims{}, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte(s.cfg.JWTSecret), nil
	})
	if err != nil {
		return nil, ErrUnauthorized
	}
	claims, ok := token.Claims.(*jwtClaims)
	if !ok || !token.Valid {
		return nil, ErrUnauthorized
	}
	return claims, nil
}

func (s *Service) invalidateInviteCache(ctx context.Context) {
	_ = s.cache.Delete(ctx, cache.InviteSettingsKey())
}

func (s *Service) GetSettings(ctx context.Context) (*models.WeddingSettings, error) {
	var settings models.WeddingSettings
	if err := s.db.First(&settings, 1).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return &settings, nil
}

func (s *Service) UpdateSettings(ctx context.Context, input dto.WeddingSettingsDTO) (*models.WeddingSettings, error) {
	settings, err := s.GetSettings(ctx)
	if err != nil {
		return nil, err
	}
	settings.GroomName = input.GroomName
	settings.BrideName = input.BrideName
	settings.WeddingDate = input.WeddingDate
	settings.HeroPhotoURL = input.HeroPhotoURL
	settings.WelcomeText = input.WelcomeText
	settings.VenueName = input.VenueName
	settings.VenueAddress = input.VenueAddress
	settings.YandexMapURL = input.YandexMapURL
	settings.DressCodeText = input.DressCodeText
	settings.FooterText = input.FooterText
	settings.AccentColor = input.AccentColor
	settings.SecondaryColor = input.SecondaryColor
	settings.UpdatedAt = time.Now()
	if err := s.db.Save(settings).Error; err != nil {
		return nil, err
	}
	s.invalidateInviteCache(ctx)
	return settings, nil
}

func (s *Service) ListProgram() ([]models.ProgramItem, error) {
	var items []models.ProgramItem
	err := s.db.Order("sort_order asc, id asc").Find(&items).Error
	return items, err
}

func (s *Service) CreateProgramItem(item dto.ProgramItemRequest) (*models.ProgramItem, error) {
	p := models.ProgramItem{Time: item.Time, Title: item.Title, SortOrder: item.SortOrder}
	if err := s.db.Create(&p).Error; err != nil {
		return nil, err
	}
	s.invalidateInviteCache(context.Background())
	return &p, nil
}

func (s *Service) UpdateProgramItem(id uint, item dto.ProgramItemRequest) (*models.ProgramItem, error) {
	var p models.ProgramItem
	if err := s.db.First(&p, id).Error; err != nil {
		return nil, ErrNotFound
	}
	p.Time = item.Time
	p.Title = item.Title
	p.SortOrder = item.SortOrder
	if err := s.db.Save(&p).Error; err != nil {
		return nil, err
	}
	s.invalidateInviteCache(context.Background())
	return &p, nil
}

func (s *Service) DeleteProgramItem(id uint) error {
	res := s.db.Delete(&models.ProgramItem{}, id)
	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected == 0 {
		return ErrNotFound
	}
	s.invalidateInviteCache(context.Background())
	return nil
}

func (s *Service) ListFAQ() ([]models.FAQItem, error) {
	var items []models.FAQItem
	err := s.db.Order("sort_order asc, id asc").Find(&items).Error
	return items, err
}

func (s *Service) CreateFAQItem(item dto.FAQItemRequest) (*models.FAQItem, error) {
	f := models.FAQItem{Question: item.Question, Answer: item.Answer, SortOrder: item.SortOrder}
	if err := s.db.Create(&f).Error; err != nil {
		return nil, err
	}
	s.invalidateInviteCache(context.Background())
	return &f, nil
}

func (s *Service) UpdateFAQItem(id uint, item dto.FAQItemRequest) (*models.FAQItem, error) {
	var f models.FAQItem
	if err := s.db.First(&f, id).Error; err != nil {
		return nil, ErrNotFound
	}
	f.Question = item.Question
	f.Answer = item.Answer
	f.SortOrder = item.SortOrder
	if err := s.db.Save(&f).Error; err != nil {
		return nil, err
	}
	s.invalidateInviteCache(context.Background())
	return &f, nil
}

func (s *Service) DeleteFAQItem(id uint) error {
	res := s.db.Delete(&models.FAQItem{}, id)
	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected == 0 {
		return ErrNotFound
	}
	s.invalidateInviteCache(context.Background())
	return nil
}

func (s *Service) ListGuests() ([]models.Guest, error) {
	var guests []models.Guest
	err := s.db.Preload("RSVP").Order("created_at desc").Find(&guests).Error
	return guests, err
}

func (s *Service) CreateGuest(name string) (*models.Guest, error) {
	g := models.Guest{Name: name, Token: uuid.New().String()}
	if err := s.db.Create(&g).Error; err != nil {
		return nil, err
	}
	return &g, nil
}

func (s *Service) DeleteGuest(id uint) error {
	res := s.db.Delete(&models.Guest{}, id)
	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected == 0 {
		return ErrNotFound
	}
	return nil
}

func (s *Service) ListVenues() ([]models.VenueItem, error) {
	var items []models.VenueItem
	err := s.db.Order("sort_order asc, id asc").Find(&items).Error
	return items, err
}

func (s *Service) GetInvitation(ctx context.Context, token string) (*dto.InvitationResponse, error) {
	var guest models.Guest
	if err := s.db.Preload("RSVP").Where("token = ?", token).First(&guest).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrNotFound
		}
		return nil, err
	}

	settings, program, faq, venues, err := s.getPublicData(ctx)
	if err != nil {
		return nil, err
	}

	resp := &dto.InvitationResponse{
		GuestName: guest.Name,
		Settings:  toSettingsDTO(settings),
		Program:   toProgramDTO(program),
		FAQ:       toFAQDTO(faq),
		Venues:    toVenueDTO(venues),
	}
	if guest.RSVP != nil {
		resp.RSVP = toRSVPDTO(guest.RSVP)
	}
	return resp, nil
}

func (s *Service) getPublicData(ctx context.Context) (*models.WeddingSettings, []models.ProgramItem, []models.FAQItem, []models.VenueItem, error) {
	type cached struct {
		Settings models.WeddingSettings `json:"settings"`
		Program  []models.ProgramItem   `json:"program"`
		FAQ      []models.FAQItem       `json:"faq"`
		Venues   []models.VenueItem     `json:"venues"`
	}
	var data cached
	found, err := s.cache.GetJSON(ctx, cache.InviteSettingsKey(), &data)
	if err != nil {
		return nil, nil, nil, nil, err
	}
	if found {
		return &data.Settings, data.Program, data.FAQ, data.Venues, nil
	}

	settings, err := s.GetSettings(ctx)
	if err != nil {
		return nil, nil, nil, nil, err
	}
	program, err := s.ListProgram()
	if err != nil {
		return nil, nil, nil, nil, err
	}
	faq, err := s.ListFAQ()
	if err != nil {
		return nil, nil, nil, nil, err
	}
	venues, err := s.ListVenues()
	if err != nil {
		return nil, nil, nil, nil, err
	}

	data = cached{Settings: *settings, Program: program, FAQ: faq, Venues: venues}
	_ = s.cache.SetJSON(ctx, cache.InviteSettingsKey(), data, cache.InviteSettingsTTL())

	return settings, program, faq, venues, nil
}

func (s *Service) SubmitRSVP(ctx context.Context, token string, req dto.SubmitRSVPRequest) (*dto.RSVPResponse, error) {
	var guest models.Guest
	if err := s.db.Preload("RSVP").Where("token = ?", token).First(&guest).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	if guest.RSVP != nil {
		return nil, ErrRSVPExists
	}

	rsvp := models.RSVP{
		GuestID:     guest.ID,
		Attending:   req.Attending,
		GuestsCount: req.GuestsCount,
		Comment:     req.Comment,
		SubmittedAt: time.Now(),
	}
	if err := s.db.Create(&rsvp).Error; err != nil {
		return nil, err
	}

	// Queue placeholder for future notifications
	_ = s.cache.Client().LPush(ctx, "rsvp:queue", fmt.Sprintf("%d", guest.ID)).Err()

	return toRSVPDTO(&rsvp), nil
}

func (s *Service) ListRSVPs(filter string) ([]dto.RSVPDTO, error) {
	var guests []models.Guest
	q := s.db.Preload("RSVP").Order("name asc")
	if err := q.Find(&guests).Error; err != nil {
		return nil, err
	}

	out := make([]dto.RSVPDTO, 0)
	for _, g := range guests {
		if g.RSVP == nil {
			if filter == "no_response" || filter == "" {
				continue
			}
			if filter != "" {
				continue
			}
		}
		if g.RSVP != nil {
			if filter == "confirmed" && !g.RSVP.Attending {
				continue
			}
			if filter == "declined" && g.RSVP.Attending {
				continue
			}
			if filter == "no_response" {
				continue
			}
			out = append(out, dto.RSVPDTO{
				ID:          g.RSVP.ID,
				GuestID:     g.ID,
				GuestName:   g.Name,
				Attending:   g.RSVP.Attending,
				GuestsCount: g.RSVP.GuestsCount,
				Comment:     g.RSVP.Comment,
				SubmittedAt: g.RSVP.SubmittedAt,
			})
		}
	}
	return out, nil
}

func (s *Service) ListAllRSVPsWithGuests() ([]dto.RSVPDTO, error) {
	var guests []models.Guest
	if err := s.db.Preload("RSVP").Order("name asc").Find(&guests).Error; err != nil {
		return nil, err
	}
	out := make([]dto.RSVPDTO, 0, len(guests))
	for _, g := range guests {
		if g.RSVP == nil {
			continue
		}
		out = append(out, dto.RSVPDTO{
			ID:          g.RSVP.ID,
			GuestID:     g.ID,
			GuestName:   g.Name,
			Attending:   g.RSVP.Attending,
			GuestsCount: g.RSVP.GuestsCount,
			Comment:     g.RSVP.Comment,
			SubmittedAt: g.RSVP.SubmittedAt,
		})
	}
	return out, nil
}

func (s *Service) DashboardStats() (*dto.DashboardStats, error) {
	var total int64
	if err := s.db.Model(&models.Guest{}).Count(&total).Error; err != nil {
		return nil, err
	}

	var confirmed, declined int64
	s.db.Model(&models.RSVP{}).Where("attending = ?", true).Count(&confirmed)
	s.db.Model(&models.RSVP{}).Where("attending = ?", false).Count(&declined)

	var totalAttendees int64
	s.db.Model(&models.RSVP{}).Where("attending = ?", true).Select("COALESCE(SUM(guests_count), 0)").Scan(&totalAttendees)

	var responded int64
	s.db.Model(&models.RSVP{}).Count(&responded)

	return &dto.DashboardStats{
		TotalGuests:    total,
		Confirmed:      confirmed,
		Declined:       declined,
		NoResponse:     total - responded,
		TotalAttendees: totalAttendees,
	}, nil
}

func (s *Service) PublicURL() string {
	return s.cfg.PublicURL
}

func toSettingsDTO(s *models.WeddingSettings) dto.WeddingSettingsDTO {
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

func toProgramDTO(items []models.ProgramItem) []dto.ProgramItemDTO {
	out := make([]dto.ProgramItemDTO, len(items))
	for i, item := range items {
		out[i] = dto.ProgramItemDTO{ID: item.ID, Time: item.Time, Title: item.Title, SortOrder: item.SortOrder}
	}
	return out
}

func toFAQDTO(items []models.FAQItem) []dto.FAQItemDTO {
	out := make([]dto.FAQItemDTO, len(items))
	for i, item := range items {
		out[i] = dto.FAQItemDTO{ID: item.ID, Question: item.Question, Answer: item.Answer, SortOrder: item.SortOrder}
	}
	return out
}

func toVenueDTO(items []models.VenueItem) []dto.VenueItemDTO {
	out := make([]dto.VenueItemDTO, len(items))
	for i, item := range items {
		out[i] = dto.VenueItemDTO{
			ID:          item.ID,
			Title:       item.Title,
			Address:     item.Address,
			MapEmbedURL: item.MapEmbedURL,
			MapLinkURL:  item.MapLinkURL,
			SortOrder:   item.SortOrder,
		}
	}
	return out
}

func toRSVPDTO(r *models.RSVP) *dto.RSVPResponse {
	return &dto.RSVPResponse{
		Attending:   r.Attending,
		GuestsCount: r.GuestsCount,
		Comment:     r.Comment,
		SubmittedAt: r.SubmittedAt,
	}
}

func ToGuestDTO(g models.Guest, publicURL string) dto.GuestDTO {
	d := dto.GuestDTO{
		ID:        g.ID,
		Name:      g.Name,
		Token:     g.Token,
		InviteURL: fmt.Sprintf("%s/invite/%s", publicURL, g.Token),
		CreatedAt: g.CreatedAt,
	}
	if g.RSVP != nil {
		d.RSVP = toRSVPDTO(g.RSVP)
	}
	return d
}
