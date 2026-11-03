package repository

import (
	"context"

	"github.com/aggieworks/dibs/internal/core/model"
	"gorm.io/gorm"
)

// Implements port.LikeRepository interface with access to Postgres instance.
type LikeRepository struct {
	db *gorm.DB
}

// NewLikeRepository creates a new instance of LikeRepository.
func NewLikeRepository(db *gorm.DB) *LikeRepository {
	return &LikeRepository{
		db: db,
	}
}

// GetNumberOfLikesByDealId returns the number of likes for a deal post.
func (r *LikeRepository) GetNumberOfLikesByDealId(ctx context.Context, dealId string) (int, error) {
	var count int64
	result := r.db.Model(&model.Like{}).Where("deal_id = ?", dealId).Count(&count)
	if result.Error != nil {
		return 0, result.Error
	}
	return int(count), nil
}

// GetLikeByUserIdAndDealId retrieves a like from the database based on user and deal ID.
func (r *LikeRepository) GetLikeByUserIdAndDealId(ctx context.Context, userId, dealId string) (*model.Like, error) {
	var like model.Like
	result := r.db.Where("user_id = ? AND deal_id = ?", userId, dealId).First(&like)
	if result.Error != nil {
		return nil, result.Error
	}
	return &like, nil
}

// CreateLike creates a new like in the database.
func (r *LikeRepository) CreateLike(ctx context.Context, like *model.Like) (*model.Like, error) {
	result := r.db.Create(like)
	if result.Error != nil {
		return nil, result.Error
	}
	return like, nil
}

// DeleteLike removes a like from the database.
func (r *LikeRepository) DeleteLike(ctx context.Context, userId, dealId string) error {
	result := r.db.Where("user_id = ? AND deal_id = ?", userId, dealId).Delete(&model.Like{})
	return result.Error
}
