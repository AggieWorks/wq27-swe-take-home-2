package repository

import (
	"context"

	"github.com/aggieworks/dibs/internal/core/model"
	"gorm.io/gorm"
)

// Implements port.UserRepository interface with access to Postgres instance.
type UserRepository struct {
	db *gorm.DB
}

// NewUserRepository creates a new UserRepository instance.
func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

// GetUserByID selects a user from the database based on the ID.
func (r *UserRepository) GetUserByID(ctx context.Context, userID string) (*model.User, error) {
	var user model.User

	result := r.db.Where("id = ?", userID).First(&user)
	if result.Error != nil {
		return nil, result.Error
	}

	return &user, nil
}

// GetUserByIdAndPhone selects a user from the database based on the ID and phone number.
func (r *UserRepository) GetUserByIdAndPhone(ctx context.Context, userId, phone string) (*model.User, error) {
	var user model.User

	result := r.db.Where("id = ? AND phone = ?", userId, phone).First(&user)
	if result.Error != nil {
		return nil, result.Error
	}

	return &user, nil
}

// GetUserByPhone selects a user from the database based on phone number.
func (r *UserRepository) GetUserByPhone(ctx context.Context, phone string) (*model.User, error) {
	var user model.User

	result := r.db.Where("phone = ?", phone).First(&user)
	if result.Error != nil {
		return nil, result.Error
	}

	return &user, nil
}

// CreateUserByPhone creates a new user in the database based on the phone number.
func (r *UserRepository) CreateUserByPhone(ctx context.Context, phone string) (*model.User, error) {
	var user model.User
	user.Phone = phone

	// Create new user if not found, otherwise return user
	result := r.db.Where("phone = ?", user.Phone).FirstOrInit(&user)
	if result.Error != nil {
		return nil, result.Error
	}

	return &user, nil
}

// UpdateUser updates the user by ID in the database.
func (r *UserRepository) UpdateUser(ctx context.Context, user *model.User) (*model.User, error) {
	// Save new user
	result := r.db.Save(&user)
	if result.Error != nil {
		return nil, result.Error
	}

	return user, nil
}

// New functions for OAuth
func (r *UserRepository) CreateNewUser(email string, nickname string) (*model.User, error) {
	var user model.User
	user.Email = email
	user.Nickname = nickname

	// Create new user if not found, otherwise return user
	// Search only by email, since nickname can change
	result := r.db.Where("email = ?", user.Email).FirstOrCreate(&user)
	if result.Error != nil {
		return nil, result.Error
	}

	return &user, nil
}

// GetUserByPhone selects a user from the database based on email address.
func (r *UserRepository) GetUserByEmail(ctx context.Context, email string) (*model.User, error) {
	var user model.User

	result := r.db.Where("email = ?", email).First(&user)
	if result.Error != nil {
		return nil, result.Error
	}

	return &user, nil
}

// GetUserByIdAndPhone selects a user from the database based on the ID and email address.
func (r *UserRepository) GetUserByIdAndEmail(ctx context.Context, userId, email string) (*model.User, error) {
	var user model.User

	result := r.db.Where("id = ? AND email = ?", userId, email).First(&user)
	if result.Error != nil {
		return nil, result.Error
	}

	return &user, nil
}
