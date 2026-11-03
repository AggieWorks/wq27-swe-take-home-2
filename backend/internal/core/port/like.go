package port

import (
	"context"

	"github.com/aggieworks/dibs/internal/core/model"
)

// LikeRepository defines the interface for like-related data operations in the database.
type LikeRepository interface {
	GetNumberOfLikesByDealId(ctx context.Context, dealId string) (int, error)
	GetLikeByUserIdAndDealId(ctx context.Context, userId, dealId string) (*model.Like, error)
	CreateLike(ctx context.Context, like *model.Like) (*model.Like, error)
	DeleteLike(ctx context.Context, userId, dealId string) error
}

// LikeService defines the interface for like-related operations in the application.
type LikeService interface {
	GetNumberOfLikesByDealId(ctx context.Context, dealId string) (int, error)
	CheckUserLikedDeal(ctx context.Context, userId, dealId string) bool
	LikeDeal(ctx context.Context, like *model.Like) (*model.Like, error)
	UnlikeDeal(ctx context.Context, userId, dealId string) error
}
