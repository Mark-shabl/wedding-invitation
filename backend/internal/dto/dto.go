package dto

import "time"

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	AccessToken string `json:"access_token"`
	ExpiresIn   int64  `json:"expires_in"`
}

type ProgramItemDTO struct {
	ID        uint   `json:"id"`
	Time      string `json:"time"`
	Title     string `json:"title"`
	SortOrder int    `json:"sort_order"`
}

type FAQItemDTO struct {
	ID        uint   `json:"id"`
	Question  string `json:"question"`
	Answer    string `json:"answer"`
	SortOrder int    `json:"sort_order"`
}

type WeddingSettingsDTO struct {
	GroomName      string    `json:"groom_name"`
	BrideName      string    `json:"bride_name"`
	WeddingDate    time.Time `json:"wedding_date"`
	HeroPhotoURL   string    `json:"hero_photo_url"`
	WelcomeText    string    `json:"welcome_text"`
	VenueName      string    `json:"venue_name"`
	VenueAddress   string    `json:"venue_address"`
	YandexMapURL   string    `json:"yandex_map_url"`
	DressCodeText  string    `json:"dress_code_text"`
	FooterText     string    `json:"footer_text"`
	AccentColor    string    `json:"accent_color"`
	SecondaryColor string    `json:"secondary_color"`
}

type InvitationResponse struct {
	GuestName  string             `json:"guest_name"`
	Settings   WeddingSettingsDTO `json:"settings"`
	Program    []ProgramItemDTO   `json:"program"`
	FAQ        []FAQItemDTO       `json:"faq"`
	Venues     []VenueItemDTO     `json:"venues"`
	RSVP       *RSVPResponse      `json:"rsvp,omitempty"`
}

type VenueItemDTO struct {
	ID          uint   `json:"id"`
	Title       string `json:"title"`
	Address     string `json:"address"`
	MapEmbedURL string `json:"map_embed_url"`
	MapLinkURL  string `json:"map_link_url"`
	SortOrder   int    `json:"sort_order"`
}

type RSVPResponse struct {
	Attending   bool      `json:"attending"`
	GuestsCount int       `json:"guests_count"`
	Comment     string    `json:"comment"`
	SubmittedAt time.Time `json:"submitted_at"`
}

type SubmitRSVPRequest struct {
	Attending   bool   `json:"attending"`
	GuestsCount int    `json:"guests_count" binding:"required,min=1,max=10"`
	Comment     string `json:"comment"`
}

type GuestDTO struct {
	ID        uint          `json:"id"`
	Name      string        `json:"name"`
	Token     string        `json:"token"`
	InviteURL string        `json:"invite_url"`
	CreatedAt time.Time     `json:"created_at"`
	RSVP      *RSVPResponse `json:"rsvp,omitempty"`
}

type CreateGuestRequest struct {
	Name string `json:"name" binding:"required,min=1,max=256"`
}

type DashboardStats struct {
	TotalGuests   int64 `json:"total_guests"`
	Confirmed     int64 `json:"confirmed"`
	Declined      int64 `json:"declined"`
	NoResponse    int64 `json:"no_response"`
	TotalAttendees int64 `json:"total_attendees"`
}

type RSVPDTO struct {
	ID          uint      `json:"id"`
	GuestID     uint      `json:"guest_id"`
	GuestName   string    `json:"guest_name"`
	Attending   bool      `json:"attending"`
	GuestsCount int       `json:"guests_count"`
	Comment     string    `json:"comment"`
	SubmittedAt time.Time `json:"submitted_at"`
}

type ProgramItemRequest struct {
	Time      string `json:"time" binding:"required"`
	Title     string `json:"title" binding:"required"`
	SortOrder int    `json:"sort_order"`
}

type FAQItemRequest struct {
	Question  string `json:"question" binding:"required"`
	Answer    string `json:"answer" binding:"required"`
	SortOrder int    `json:"sort_order"`
}

type UploadResponse struct {
	URL string `json:"url"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}
