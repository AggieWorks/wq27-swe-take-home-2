package service

import (
	"context"
	"testing"

	"github.com/aggieworks/dibs/internal/core/model"
	"github.com/aggieworks/dibs/internal/core/port/mock"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"go.uber.org/mock/gomock"
)

// TestNewBusinessService tests the NewBusinessService method.
func TestNewBusinessService(t *testing.T) {
	mockCtrl := gomock.NewController(t)

	// Configure mock business repository
	mockBusinessRepo := mock.NewMockBusinessRepository(mockCtrl)

	// Create business service
	businessService := NewBusinessService(mockBusinessRepo)

	assert.NotNil(t, businessService)
	assert.Equal(t, mockBusinessRepo, businessService.repo)
}

// TestGetAllBusinesses tests the GetAllBusinesses method, ensuring all businesses from the repository are returned.
func TestGetAllBusinesses(t *testing.T) {
	mockCtrl := gomock.NewController(t)

	// Configure mock business repository
	mockBusinesses := []model.Business{
		{
			Id:   uuid.New(),
			Name: "Test Business",
		},
	}
	mockBusinessRepo := mock.NewMockBusinessRepository(mockCtrl)
	mockBusinessRepo.EXPECT().GetAllBusinesses(gomock.Any()).Return(mockBusinesses, nil)

	// Create business service and call GetAllBusinesses
	businessService := NewBusinessService(mockBusinessRepo)
	businesses, err := businessService.GetAllBusinesses(context.Background())

	assert.NoError(t, err)
	assert.NotNil(t, businesses)
	assert.Equal(t, len(mockBusinesses), len(businesses))
	assert.Equal(t, mockBusinesses[0].Id, businesses[0].Id)
	assert.Equal(t, mockBusinesses[0].Name, businesses[0].Name)
}

// TestGetAllBusinesses_FailedRepo tests the GetAllBusinesses method when it fails to get businesses from database.
func TestGetAllBusinesses_FailedRepo(t *testing.T) {
	mockCtrl := gomock.NewController(t)

	// Configure mock business repository
	mockBusinessRepo := mock.NewMockBusinessRepository(mockCtrl)
	mockBusinessRepo.EXPECT().GetAllBusinesses(gomock.Any()).Return(nil, assert.AnError)

	// Create business service and call GetAllBusinesses
	businessService := NewBusinessService(mockBusinessRepo)
	businesses, err := businessService.GetAllBusinesses(context.Background())

	assert.Error(t, err)
	assert.Nil(t, businesses)
}

// TestGetBusinessById tests the GetBusinessById method, ensuring a business from the repository is returned.
func TestGetBusinessById(t *testing.T) {
	mockCtrl := gomock.NewController(t)

	// Configure mock business repository
	mockBusiness := &model.Business{
		Id:   uuid.New(),
		Name: "Test Business",
	}
	mockBusinessRepo := mock.NewMockBusinessRepository(mockCtrl)
	mockBusinessRepo.EXPECT().GetBusinessById(gomock.Any(), gomock.Any()).Return(mockBusiness, nil)

	// Create business service and call GetBusinessById
	businessService := NewBusinessService(mockBusinessRepo)
	business, err := businessService.GetBusinessById(context.Background(), mockBusiness.Id.String())

	assert.NoError(t, err)
	assert.NotNil(t, business)
	assert.Equal(t, mockBusiness.Id, business.Id)
	assert.Equal(t, mockBusiness.Name, business.Name)
}

// TestGetBusinessById_FailedRepo tests the GetBusinessById method when it fails to get business from database.
func TestGetBusinessById_FailedRepo(t *testing.T) {
	mockCtrl := gomock.NewController(t)

	// Configure mock business repository
	mockBusinessRepo := mock.NewMockBusinessRepository(mockCtrl)
	mockBusinessRepo.EXPECT().GetBusinessById(gomock.Any(), gomock.Any()).Return(nil, assert.AnError)

	// Create business service and call GetBusinessById
	businessService := NewBusinessService(mockBusinessRepo)
	business, err := businessService.GetBusinessById(context.Background(), uuid.New().String())

	assert.Error(t, err)
	assert.Nil(t, business)
}

// TestCreateBusiness tests the CreateBusiness method, ensuring a new business is created in the repository.
func TestCreateBusiness(t *testing.T) {
	mockCtrl := gomock.NewController(t)

	// Configure mock business repository
	mockBusiness := &model.Business{
		Id:   uuid.New(),
		Name: "Test Business",
	}
	mockBusinessRepo := mock.NewMockBusinessRepository(mockCtrl)
	mockBusinessRepo.EXPECT().CreateBusiness(gomock.Any(), gomock.Any()).Return(mockBusiness, nil)

	// Create business service and call CreateBusiness
	businessService := NewBusinessService(mockBusinessRepo)
	createdBusiness, err := businessService.CreateBusiness(context.Background(), mockBusiness)

	assert.NoError(t, err)
	assert.NotNil(t, createdBusiness)
	assert.Equal(t, mockBusiness.Id, createdBusiness.Id)
	assert.Equal(t, mockBusiness.Name, createdBusiness.Name)
}

// TestCreateBusiness_FailedRepo tests the CreateBusiness method when it fails to create business in database.
func TestCreateBusiness_FailedRepo(t *testing.T) {
	mockCtrl := gomock.NewController(t)

	// Configure mock business repository
	mockBusinessRepo := mock.NewMockBusinessRepository(mockCtrl)
	mockBusinessRepo.EXPECT().CreateBusiness(gomock.Any(), gomock.Any()).Return(nil, assert.AnError)

	// Create business service and call CreateBusiness
	businessService := NewBusinessService(mockBusinessRepo)
	createdBusiness, err := businessService.CreateBusiness(context.Background(), &model.Business{})

	assert.Error(t, err)
	assert.Nil(t, createdBusiness)
}

// TestUpdateBusiness tests the UpdateBusiness method, ensuring a business is updated in the repository.
func TestUpdateBusiness(t *testing.T) {
	mockCtrl := gomock.NewController(t)

	// Configure mock business repository
	mockBusiness := &model.Business{
		Id:   uuid.New(),
		Name: "Test Business",
	}
	mockBusinessRepo := mock.NewMockBusinessRepository(mockCtrl)
	mockBusinessRepo.EXPECT().UpdateBusiness(gomock.Any(), gomock.Any()).Return(mockBusiness, nil)

	// Create business service and call UpdateBusiness
	businessService := NewBusinessService(mockBusinessRepo)
	updatedBusiness, err := businessService.UpdateBusiness(context.Background(), mockBusiness)

	assert.NoError(t, err)
	assert.NotNil(t, updatedBusiness)
	assert.Equal(t, mockBusiness.Id, updatedBusiness.Id)
	assert.Equal(t, mockBusiness.Name, updatedBusiness.Name)
}

// TestUpdateBusiness_FailedRepo tests the UpdateBusiness method when it fails to update business in database.
func TestUpdateBusiness_FailedRepo(t *testing.T) {
	mockCtrl := gomock.NewController(t)

	// Configure mock business repository
	mockBusinessRepo := mock.NewMockBusinessRepository(mockCtrl)
	mockBusinessRepo.EXPECT().UpdateBusiness(gomock.Any(), gomock.Any()).Return(nil, assert.AnError)

	// Create business service and call UpdateBusiness
	businessService := NewBusinessService(mockBusinessRepo)
	updatedBusiness, err := businessService.UpdateBusiness(context.Background(), &model.Business{})

	assert.Error(t, err)
	assert.Nil(t, updatedBusiness)
}

// TestDeleteBusinessById tests the DeleteBusinessById method, ensuring a business is deleted in the repository.
func TestDeleteBusinessById(t *testing.T) {
	mockCtrl := gomock.NewController(t)

	// Configure mock business repository
	mockBusinessRepo := mock.NewMockBusinessRepository(mockCtrl)
	mockBusinessRepo.EXPECT().DeleteBusinessById(gomock.Any(), gomock.Any()).Return(nil)

	// Create business service and call DeleteBusinessById
	businessService := NewBusinessService(mockBusinessRepo)
	err := businessService.DeleteBusinessById(context.Background(), uuid.New().String())

	assert.NoError(t, err)
}

// TestDeleteBusinessById_FailedRepo tests the DeleteBusinessById method when it fails to delete business in database.
func TestDeleteBusinessById_FailedRepo(t *testing.T) {
	mockCtrl := gomock.NewController(t)

	// Configure mock business repository
	mockBusinessRepo := mock.NewMockBusinessRepository(mockCtrl)
	mockBusinessRepo.EXPECT().DeleteBusinessById(gomock.Any(), gomock.Any()).Return(assert.AnError)

	// Create business service and call DeleteBusinessById
	businessService := NewBusinessService(mockBusinessRepo)
	err := businessService.DeleteBusinessById(context.Background(), uuid.New().String())

	assert.Error(t, err)
}
