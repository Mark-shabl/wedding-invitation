package models

import (
	"time"
)

type AdminUser struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Username     string    `gorm:"uniqueIndex;size:64;not null" json:"username"`
	PasswordHash string    `gorm:"not null" json:"-"`
	CreatedAt    time.Time `json:"created_at"`
}

type WeddingSettings struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	GroomName       string    `gorm:"size:128;not null" json:"groom_name"`
	BrideName       string    `gorm:"size:128;not null" json:"bride_name"`
	WeddingDate     time.Time `gorm:"not null" json:"wedding_date"`
	HeroPhotoURL    string    `gorm:"size:512" json:"hero_photo_url"`
	WelcomeText     string    `gorm:"type:text" json:"welcome_text"`
	VenueName       string    `gorm:"size:256" json:"venue_name"`
	VenueAddress    string    `gorm:"size:512" json:"venue_address"`
	YandexMapURL    string    `gorm:"size:1024" json:"yandex_map_url"`
	DressCodeText   string    `gorm:"type:text" json:"dress_code_text"`
	FooterText      string    `gorm:"size:512" json:"footer_text"`
	AccentColor     string    `gorm:"size:16;default:'#8B9A7D'" json:"accent_color"`
	SecondaryColor  string    `gorm:"size:16;default:'#C4A4A4'" json:"secondary_color"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type ProgramItem struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	Time      string `gorm:"size:16;not null" json:"time"`
	Title     string `gorm:"size:256;not null" json:"title"`
	SortOrder int    `gorm:"not null;default:0" json:"sort_order"`
}

type FAQItem struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	Question  string `gorm:"size:512;not null" json:"question"`
	Answer    string `gorm:"type:text;not null" json:"answer"`
	SortOrder int    `gorm:"not null;default:0" json:"sort_order"`
}

type VenueItem struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Title       string `gorm:"size:256;not null" json:"title"`
	Address     string `gorm:"size:512" json:"address"`
	MapEmbedURL string `gorm:"size:1024" json:"map_embed_url"`
	MapLinkURL  string `gorm:"size:1024" json:"map_link_url"`
	SortOrder   int    `gorm:"not null;default:0" json:"sort_order"`
}

type Guest struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"size:256;not null" json:"name"`
	Token     string    `gorm:"uniqueIndex;size:64;not null" json:"token"`
	CreatedAt time.Time `json:"created_at"`
	RSVP      *RSVP     `gorm:"foreignKey:GuestID" json:"rsvp,omitempty"`
}

type RSVP struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	GuestID     uint      `gorm:"uniqueIndex;not null" json:"guest_id"`
	Guest       Guest     `gorm:"foreignKey:GuestID" json:"guest,omitempty"`
	Attending   bool      `gorm:"not null" json:"attending"`
	GuestsCount int       `gorm:"default:1" json:"guests_count"`
	Comment     string    `gorm:"type:text" json:"comment"`
	SubmittedAt time.Time `json:"submitted_at"`
}
