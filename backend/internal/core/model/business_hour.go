package model

import (
	"time"

	"github.com/google/uuid"
)

// BusinessHour represents a business's operating hours for a specific day or time range.
type BusinessHour struct {
	Id         uuid.UUID `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	BusinessId uuid.UUID `json:"businessId" binding:"required" gorm:"type:uuid;not null"`
	Business   *Business `json:"-" gorm:"foreignKey:BusinessId"`
	DayOfWeek  int       `json:"dayOfWeek" binding:"gte=0,lte=6"` // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
	OpenTime   int       `json:"openTime" binding:"required"`     // Duration since midnight of current day (minutes)
	CloseTime  int       `json:"closeTime" binding:"required"`    // Duration since midnight of current day (minutes) - can go past 24 * 60 = 1440 minutes
	IsClosed   bool      `json:"isClosed" gorm:"default:false"`
	CreatedAt  time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt  time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
}
