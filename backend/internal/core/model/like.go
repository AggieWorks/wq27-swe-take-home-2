package model

import (
	"time"

	"github.com/google/uuid"
)

// Like model for user likes on deal posts
type Like struct {
	UserId    uuid.UUID `json:"userId" gorm:"primaryKey;type:uuid;not null"`
	DealId    uuid.UUID `json:"dealId" gorm:"primaryKey;type:uuid;not null"`
	CreatedAt time.Time `json:"createdAt" gorm:"autoCreateTime"`
}
