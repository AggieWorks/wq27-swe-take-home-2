package model

import (
	"time"

	"github.com/google/uuid"
)

// Business represents a business entity with basic fields such as ID and Name.
type Business struct {
	Id          uuid.UUID       `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	Name        string          `json:"name" binding:"required" gorm:"unique;not null;default:null"`
	Address     string          `json:"address" gorm:"default:''"`
	Image       string          `json:"image" gorm:"default:''"`
	CreatedAt   time.Time       `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt   time.Time       `json:"updatedAt" gorm:"autoUpdateTime"`
	Deals       []*Deal         `json:"-" gorm:"foreignKey:BusinessId"`
	Hours       []*BusinessHour `json:"hours" gorm:"foreignKey:BusinessId"`
	CuisineType string          `json:"cuisineType" gorm:"default:''"`
}
