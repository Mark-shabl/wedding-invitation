package config

import (
	"strings"
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	Port         string
	DBDSN        string
	RedisURL     string
	JWTSecret    string
	AdminUser    string
	AdminPass    string
	PublicURL    string
	AdminURL     string
	UploadDir    string
	CORSOrigins  []string
	RateLimitRPS float64
	JWTExpiry    time.Duration
}

func Load() (*Config, error) {
	viper.SetDefault("PORT", "8080")
	viper.SetDefault("JWT_EXPIRY_HOURS", 24)
	viper.SetDefault("RATE_LIMIT_RPS", 10)
	viper.SetDefault("UPLOAD_DIR", "./uploads")

	viper.AutomaticEnv()
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	corsRaw := viper.GetString("CORS_ORIGINS")
	if corsRaw == "" {
		corsRaw = "http://localhost:3000,http://localhost:3001"
	}

	return &Config{
		Port:         viper.GetString("PORT"),
		DBDSN:        viper.GetString("DB_DSN"),
		RedisURL:     viper.GetString("REDIS_URL"),
		JWTSecret:    viper.GetString("JWT_SECRET"),
		AdminUser:    viper.GetString("ADMIN_USERNAME"),
		AdminPass:    viper.GetString("ADMIN_PASSWORD"),
		PublicURL:    viper.GetString("PUBLIC_URL"),
		AdminURL:     viper.GetString("ADMIN_URL"),
		UploadDir:    viper.GetString("UPLOAD_DIR"),
		CORSOrigins:  splitCSV(corsRaw),
		RateLimitRPS: viper.GetFloat64("RATE_LIMIT_RPS"),
		JWTExpiry:    time.Duration(viper.GetInt("JWT_EXPIRY_HOURS")) * time.Hour,
	}, nil
}

func splitCSV(s string) []string {
	parts := strings.Split(s, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		p = strings.TrimSpace(p)
		if p != "" {
			out = append(out, p)
		}
	}
	return out
}
