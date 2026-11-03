package port

import (
	"context"

	"github.com/aggieworks/dibs/internal/core/model"
)

// UserRepository defines the interface for user-related data operations in the database.
type UserRepository interface {
	GetUserByID(ctx context.Context, userID string) (*model.User, error)
	GetUserByIdAndPhone(ctx context.Context, userId, phone string) (*model.User, error)
	GetUserByPhone(ctx context.Context, phone string) (*model.User, error)
	CreateUserByPhone(ctx context.Context, phone string) (*model.User, error)
	UpdateUser(ctx context.Context, user *model.User) (*model.User, error)
	CreateNewUser(email string, nickname string) (*model.User, error)
	GetUserByEmail(ctx context.Context, email string) (*model.User, error)
	GetUserByIdAndEmail(ctx context.Context, userId, email string) (*model.User, error)
}

// UserService defines the interface for user-related operations in the application.
type UserService interface {
	GetUserByID(ctx context.Context, userID string) (*model.User, error)
	GetUserIfOptedIn(ctx context.Context, userId, phone string) (*model.User, error)
	GetUserByIdAndEmail(ctx context.Context, userId, email string) (*model.User, error)
	CreateNewUser(email string, nickname string) (*model.User, error)
	SubOrUnsubUser(ctx context.Context, user *model.User, isSubscribing bool) (*model.User, error)
	UpdateUser(ctx context.Context, user *model.User) (*model.User, error)
}
