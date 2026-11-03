package service

import (
	"context"

	"github.com/aggieworks/dibs/internal/core/model"
	"github.com/aggieworks/dibs/internal/core/port"
)

// LikeService implements port.LikeService interface with access to like repository.
type LikeService struct {
	repo port.LikeRepository
}

// NewLikeService creates a new instance of LikeService.
func NewLikeService(repo port.LikeRepository) *LikeService {
	return &LikeService{
		repo: repo,
	}
}

// GetNumberOfLikesByDealId retrieves the number of likes for a deal post from the repository.
func (s *LikeService) GetNumberOfLikesByDealId(ctx context.Context, dealId string) (int, error) {
	return s.repo.GetNumberOfLikesByDealId(ctx, dealId)
}

// CheckUserLikedDeal checks if a user has liked a deal post in the repository.
func (s *LikeService) CheckUserLikedDeal(ctx context.Context, userId, dealId string) bool {
	_, err := s.repo.GetLikeByUserIdAndDealId(ctx, userId, dealId)
	return err == nil
}

// LikeDeal creates a new like for a deal post in the repository.
func (s *LikeService) LikeDeal(ctx context.Context, like *model.Like) (*model.Like, error) {
	return s.repo.CreateLike(ctx, like)
}

// UnlikeDeal deletes a like for a deal post in the repository.
func (s *LikeService) UnlikeDeal(ctx context.Context, userId, dealId string) error {
	return s.repo.DeleteLike(ctx, userId, dealId)
}
