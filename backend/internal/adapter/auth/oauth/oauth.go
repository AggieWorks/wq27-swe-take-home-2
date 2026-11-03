package oauth

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"github.com/aggieworks/dibs/internal/config"
	"github.com/aggieworks/dibs/internal/core/model"
	"github.com/aggieworks/dibs/internal/core/port"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type GoogleIDToken struct {
	Iss           string `json:"iss"`
	Azp           string `json:"azp"`
	Aud           string `json:"aud"`
	Sub           string `json:"sub"`
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
	Hd            string `json:"hd,omitempty"`
	AtHash        string `json:"at_hash"`
	Name          string `json:"name"`
	Picture       string `json:"picture,omitempty"`
	GivenName     string `json:"given_name,omitempty"`
	FamilyName    string `json:"family_name,omitempty"`
	Iat           int64  `json:"iat"`
	Exp           int64  `json:"exp"`
}

type OAuthService struct {
	oauthCfg *oauth2.Config
	env      string
	us       port.UserService
}

/*
NewOAuthService creates a new OAuthService for signing in with different providers.
Currently only Google is supported.
*/
func NewOAuthService(cfg *config.OAUTH, env string, us port.UserService) *OAuthService {
	conf := &oauth2.Config{
		ClientID:     cfg.ID,
		ClientSecret: cfg.Secret,
		RedirectURL:  cfg.Callback,
		Scopes:       []string{"openid", "email", "profile"},
		Endpoint:     google.Endpoint,
	}

	return &OAuthService{
		oauthCfg: conf,
		env:      env,
		us:       us,
	}
}

// SignInWithProvider redirects the user to the OAuth provider's login page.
func (s *OAuthService) SignInWithProvider(writer http.ResponseWriter, request *http.Request) {
	provider := request.URL.Query().Get("provider")
	if provider != "google" {
		http.Error(writer, "Invalid provider", http.StatusBadRequest)
		return
	}

	url := s.oauthCfg.AuthCodeURL("state", oauth2.AccessTypeOffline)
	http.Redirect(writer, request, url, http.StatusTemporaryRedirect)
}

// CallbackHandler handles the OAuth provider's callback and creates a new user if necessary.
func (s *OAuthService) CallbackHandler(writer http.ResponseWriter, request *http.Request) (*model.User, error) {
	code := request.URL.Query().Get("code")
	if code == "" {
		http.Error(writer, "Code not found", http.StatusBadRequest)
		return nil, errors.New("code not found in query parameters")
	}

	// Exchange code for token
	token, err := s.oauthCfg.Exchange(request.Context(), code)
	if err != nil {
		http.Error(writer, "Failed to exchange token", http.StatusInternalServerError)
		return nil, err
	}

	// Validate Scope
	if !validateScope(token.Extra("scope").(string)) {
		http.Error(writer, "Invalid scope", http.StatusForbidden)
		return nil, errors.New("invalid scope")
	}

	// Decode ID Token
	idTokenStr, ok := token.Extra("id_token").(string)
	if !ok {
		http.Error(writer, "ID Token not found", http.StatusInternalServerError)
		return nil, errors.New("id_token not found in token response")
	}

	idToken, err := decodeIDToken(idTokenStr)
	if err != nil {
		http.Error(writer, "Failed to parse ID Token", http.StatusInternalServerError)
		return nil, err
	}

	// Verify email
	if !idToken.EmailVerified {
		http.Error(writer, "Email not verified", http.StatusUnauthorized)
		return nil, errors.New("email not verified")
	}

	// Create new user if necessary
	user, err := s.us.CreateNewUser(idToken.Email, idToken.Name)
	if err != nil {
		http.Error(writer, "Failed to create user", http.StatusInternalServerError)
		return nil, err
	}

	// At this point, the user is authenticated, and you can proceed with session handling.
	return user, nil
}

func validateScope(scope string) bool {
	scopes := strings.Split(scope, " ")
	for _, s := range scopes {
		if s == "https://www.googleapis.com/auth/userinfo.profile" {
			return true
		}
	}
	return false
}

func decodeIDToken(idToken string) (*GoogleIDToken, error) {
	parts := strings.Split(idToken, ".")
	if len(parts) < 2 {
		return nil, errors.New("invalid ID Token format")
	}

	decoded, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return nil, errors.New("failed to base64 decode ID Token payload")
	}

	var token GoogleIDToken
	if err := json.Unmarshal(decoded, &token); err != nil {
		return nil, errors.New("failed to parse ID Token JSON")
	}

	return &token, nil
}
