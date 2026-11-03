package port

import (
	"net/http"

	"github.com/aggieworks/dibs/internal/core/model"
	"github.com/google/uuid"
)

// TokenService contains business-logicuuid.UUID for interacting with JWT tokens.
type TokenService interface {
	GenerateToken(userId uuid.UUID, email string) (string, error)
	VerifyToken(tokenString string) (*model.TokenPayload, error)
}

// New authentication system
type AuthService interface {
	SignInWithProvider(writer http.ResponseWriter, request *http.Request)
	CallbackHandler(writer http.ResponseWriter, request *http.Request) (*model.User, error)
}
