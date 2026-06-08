package database

import (
	"fmt"
	"time"

	"wedding-invites/backend/internal/config"
	"wedding-invites/backend/internal/models"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Connect(dsn string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		return nil, fmt.Errorf("connect postgres: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}
	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetConnMaxLifetime(time.Hour)

	return db, nil
}

func Migrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.AdminUser{},
		&models.WeddingSettings{},
		&models.ProgramItem{},
		&models.FAQItem{},
		&models.VenueItem{},
		&models.Guest{},
		&models.RSVP{},
	)
}

func Seed(db *gorm.DB, cfg *config.Config) error {
	var adminCount int64
	if err := db.Model(&models.AdminUser{}).Count(&adminCount).Error; err != nil {
		return err
	}
	if adminCount == 0 && cfg.AdminUser != "" && cfg.AdminPass != "" {
		hash, err := bcrypt.GenerateFromPassword([]byte(cfg.AdminPass), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		if err := db.Create(&models.AdminUser{
			Username:     cfg.AdminUser,
			PasswordHash: string(hash),
		}).Error; err != nil {
			return err
		}
	}

	var settingsCount int64
	if err := db.Model(&models.WeddingSettings{}).Count(&settingsCount).Error; err != nil {
		return err
	}
	if settingsCount == 0 {
		weddingDate, _ := time.Parse(time.RFC3339, "2026-06-25T17:00:00+03:00")
		if err := db.Create(&models.WeddingSettings{
			ID:             1,
			GroomName:      "Никита",
			BrideName:      "Полина",
			WeddingDate:    weddingDate,
			WelcomeText:    "В нашей жизни скоро состоится важное событие — наша свадьба! Мы приглашаем вас и будем рады провести этот особенный день в кругу самых близких людей!",
			VenueName:      "Ресторан «Дюшес»",
			VenueAddress:   "г. Москва",
			YandexMapURL:   "https://yandex.ru/maps/",
			DressCodeText:  "Мы очень старались сделать нашу свадьбу стильной. Поэтому будем рады, если вы поддержите нашу цветовую гамму.",
			FooterText:     "Будем счастливы видеть вас!",
			AccentColor:    "#8B9A7D",
			SecondaryColor: "#C4A4A4",
		}).Error; err != nil {
			return err
		}

		program := []models.ProgramItem{
			{Time: "12:00", Title: "Церемония регистрации", SortOrder: 1},
			{Time: "16:00", Title: "Сбор гостей", SortOrder: 2},
			{Time: "17:00", Title: "Праздничный ужин", SortOrder: 3},
			{Time: "22:00", Title: "Завершение вечера", SortOrder: 4},
		}
		if err := db.Create(&program).Error; err != nil {
			return err
		}

		faq := []models.FAQItem{
			{Question: "Будет ли дресс код?", Answer: "Да! Мы подготовили палитру цветов и примеры нарядов — смотрите раздел «Дресс-код» на этой странице.", SortOrder: 1},
			{Question: "Можно ли с детьми?", Answer: "Мы с радостью приглашаем вас, но просим заранее сообщить, если планируете взять с собой детей.", SortOrder: 2},
			{Question: "Есть ли парковка?", Answer: "Да, рядом с рестораном есть бесплатная парковка для гостей.", SortOrder: 3},
		}
		if err := db.Create(&faq).Error; err != nil {
			return err
		}

		guests := []models.Guest{
			{Name: "Александр Иванов", Token: uuid.New().String()},
			{Name: "Мария Петрова", Token: uuid.New().String()},
			{Name: "Дмитрий Сидоров", Token: uuid.New().String()},
		}
		if err := db.Create(&guests).Error; err != nil {
			return err
		}
	}

	var venueCount int64
	if err := db.Model(&models.VenueItem{}).Count(&venueCount).Error; err != nil {
		return err
	}
	if venueCount == 0 {
		venues := []models.VenueItem{
			{
				Title:       "Зеленоградский Дворец бракосочетания",
				Address:     "г. Зеленоград",
				MapEmbedURL: "https://yandex.ru/map-widget/v1/?um=constructor%3A9a637b19c98a2dfa10fafc8113fb8cd2cb96c973cfb12fb4220a11f30fcdbb84&source=constructor",
				MapLinkURL:  "https://yandex.ru/maps/?um=constructor%3A9a637b19c98a2dfa10fafc8113fb8cd2cb96c973cfb12fb4220a11f30fcdbb84&source=constructor",
				SortOrder:   1,
			},
			{
				Title:       "Банкетный зал — ресторан «Дюшес»",
				Address:     "г. Москва",
				MapEmbedURL: "https://yandex.ru/map-widget/v1/?um=constructor%3A17e8f7b9f5322d63ee7fb1139ed2f70463d821b84a4e69ea4fd5218e87d80079&source=constructor",
				MapLinkURL:  "https://yandex.ru/maps/?um=constructor%3A17e8f7b9f5322d63ee7fb1139ed2f70463d821b84a4e69ea4fd5218e87d80079&source=constructor",
				SortOrder:   2,
			},
		}
		if err := db.Create(&venues).Error; err != nil {
			return err
		}
	}

	return nil
}
