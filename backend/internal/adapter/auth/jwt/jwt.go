package jwt

import (
	"fmt"
	"time"

	"github.com/aggieworks/dibs/internal/core/model"
	"github.com/aggieworks/dibs/internal/core/utils"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type jwtService struct {
	secret string
}

// NewJWTService creates a new JWTService instance.
func NewJWTService(secret string) *jwtService {
	return &jwtService{
		secret: secret,
	}
}

// GenerateToken generates a JWT token with the given claims.
func (j *jwtService) GenerateToken(userId uuid.UUID, email string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := jwt.MapClaims{
		"userId": userId,
		"email":  email,
		"exp":    time.Now().Add(time.Hour * 24 * utils.MAX_COOKIE_DAYS).Unix(),
		"iat":    time.Now().Unix(),
	}
	token.Claims = jwt.MapClaims(claims)

	return token.SignedString([]byte(j.secret))
}

// VerifyToken validates the given JWT token and returns claims if successful.
func (j *jwtService) VerifyToken(tokenString string) (*model.TokenPayload, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Validate the signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(j.secret), nil
	})
	if err != nil || !token.Valid {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, fmt.Errorf("invalid claims")
	}

	userId, ok := claims["userId"].(string)
	if !ok {
		return nil, fmt.Errorf("invalid userId")
	}
	userUUID, err := uuid.Parse(userId)
	if err != nil {
		return nil, fmt.Errorf("invalid userId")
	}

	email, ok := claims["email"].(string)
	if !ok {
		return nil, fmt.Errorf("invalid email")
	}

	return &model.TokenPayload{
		UserId: userUUID,
		Email:  email,
	}, nil
}
