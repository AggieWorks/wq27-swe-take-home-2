package service

import (
	"context"
	"errors"

	"github.com/aggieworks/dibs/internal/core/model"
	"github.com/aggieworks/dibs/internal/core/port"
	"github.com/nyaruka/phonenumbers"
)

// Implements port.UserService interface with access to user repository.
type UserService struct {
	repo port.UserRepository
}

// NewUserService creates a new instance of UserService.
func NewUserService(repo port.UserRepository) *UserService {
	return &UserService{
		repo: repo,
	}
}

// GetUserByID retrieves user based on userId.
func (s *UserService) GetUserByID(ctx context.Context, userID string) (*model.User, error) {
	return s.repo.GetUserByID(ctx, userID)
}

// GetUserIfOptedIn retrieves user based on userId and phone number, only if opted in.
func (s *UserService) GetUserIfOptedIn(ctx context.Context, userId, phone string) (*model.User, error) {
	// Get user
	user, err := s.repo.GetUserByIdAndPhone(ctx, userId, phone)
	if err != nil {
		return nil, err
	}

	// Check if user is opted in
	if user.OptedIn == nil || !*user.OptedIn {
		return nil, errors.New("user not opted in")
	}

	return user, nil
}

// GetUserByIdAndEmail retrieves user based on userId and email.
func (s *UserService) GetUserByIdAndEmail(ctx context.Context, userId, email string) (*model.User, error) {
	// Get user
	user, err := s.repo.GetUserByIdAndEmail(ctx, userId, email)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// CreateNewUser creates a new user with email and nickname.
func (s *UserService) CreateNewUser(email string, nickname string) (*model.User, error) {
	// Create new user
	user, err := s.repo.CreateNewUser(email, nickname)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// UpdateUser updates the user by ID in the database.
func (s *UserService) UpdateUser(ctx context.Context, user *model.User) (*model.User, error) {
	// Update the user
	usr, err := s.repo.UpdateUser(ctx, user)
	if err != nil {
		return nil, err
	}
	return usr, nil
}

// SubOrUnsubUser updates the user's opt-in status based on isSubscribing.
func (s *UserService) SubOrUnsubUser(ctx context.Context, user *model.User, isSubscribing bool) (*model.User, error) {
	// Validate phone number
	num, err := phonenumbers.Parse(user.Phone, "US")
	if err != nil {
		return nil, err
	}

	if isValid := phonenumbers.IsValidNumberForRegion(num, "US"); !isValid {
		return nil, errors.New("invalid phone number")
	}

	// Format phone number to E164
	user.Phone = phonenumbers.Format(num, phonenumbers.E164)

	currentUser, err := s.repo.CreateUserByPhone(ctx, user.Phone)
	if err != nil {
		return nil, err
	}

	var optedIn bool
	if isSubscribing {
		// Set OptedIn to true
		optedIn = true
	} else {
		// Set OptedIn to false
		optedIn = false
	}
	currentUser.OptedIn = &optedIn

	// Update user
	updatedUser, err := s.repo.UpdateUser(ctx, currentUser)
	if err != nil {
		return nil, err
	}

	return updatedUser, nil
}
