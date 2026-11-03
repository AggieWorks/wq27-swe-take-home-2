package model

import (
	"time"

	"github.com/google/uuid"
)

// Users that are subscribed to SMS notifications based on phone numbers
type User struct {
	Id        uuid.UUID `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	Phone     string    `json:"phone" binding:"required" gorm:"unique;default:null"`
	OptedIn   *bool     `json:"optedIn" gorm:"default:false"`
	Role      string    `json:"role" gorm:"default:'user'"`
	CreatedAt time.Time `json:"createdAt" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updatedAt" gorm:"autoUpdateTime"`
	Email     string    `json:"email" binding:"required" gorm:"unique;not null;default:null"`
	Nickname  string    `json:"nickname" binding:"required" gorm:"not null;default:null"`
}

type UserUpdate struct {
	Phone    string `json:"phone" gorm:"unique;default:null"`
	Nickname string `json:"nickname" binding:"required" gorm:"not null;default:null"`
}
