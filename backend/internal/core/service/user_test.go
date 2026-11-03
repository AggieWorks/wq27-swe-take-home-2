package service

import (
	"testing"

	"github.com/aggieworks/dibs/internal/core/port/mock"
	"github.com/stretchr/testify/assert"
	"go.uber.org/mock/gomock"
)

// TestNewUserService tests the NewUserService method.
func TestNewUserService(t *testing.T) {
	mockCtrl := gomock.NewController(t)

	// Configure mock user repository
	mockUserRepo := mock.NewMockUserRepository(mockCtrl)

	// Create user service
	userService := NewUserService(mockUserRepo)

	assert.NotNil(t, userService)
	assert.Equal(t, mockUserRepo, userService.repo)
}
