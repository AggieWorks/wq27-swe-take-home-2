/*
FORMER AUTH SERVICE
This file is the former auth service that was used to authenticate users with Google OAuth. It is no longer used in the project, but is kept here for reference.
*/

package goth

import (
	"log"
	"net/http"

	"github.com/aggieworks/dibs/internal/config"
	"github.com/aggieworks/dibs/internal/core/model"
	"github.com/aggieworks/dibs/internal/core/port"
	"github.com/gorilla/securecookie"
	"github.com/gorilla/sessions"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
)

type gothService struct {
	oauthCfg    *config.OAUTH
	env         string
	session     *sessions.CookieStore
	userService port.UserService
	tokenSvc    port.TokenService
}

func NewGothService(oauthCfg *config.OAUTH, env string, userService port.UserService, tokenSvc port.TokenService) *gothService {
	goth.UseProviders(
		google.New(oauthCfg.ID, oauthCfg.Secret, oauthCfg.Callback, "openid email profile"),
	)
	sessionManager := sessions.NewCookieStore(securecookie.GenerateRandomKey(64))
	sessionManager.Options.Path = "/"
	// Legacy: leave domain unset for host-only cookies in local dev.
	_ = env
	sessionManager.Options.HttpOnly = true
	sessionManager.Options.Secure = true
	//sessionManager.Options.MaxAge = 3600 // Logs you out after an hour, commented out cuz i think we wanted to keep you logged in forever, but kept so i remember how
	gothic.Store = sessionManager
	return &gothService{
		oauthCfg:    oauthCfg,
		env:         env,
		session:     sessionManager,
		userService: userService,
		tokenSvc:    tokenSvc,
	}
}

// Calls goth to begin authentication process. Parameters are created in /handler/auth.go
func (h *gothService) SignInWithProvider(writer http.ResponseWriter, request *http.Request) {
	gothic.BeginAuthHandler(writer, request)
}

func (h *gothService) CallbackHandler(writer http.ResponseWriter, request *http.Request) error {
	user, err := gothic.CompleteUserAuth(writer, request)
	if err != nil {
		log.Printf("Error completing user auth: %v", err)
		return err
	}

	// Creates new user, or returns the existing one if there is one
	dbUser, err := h.userService.CreateNewUser(user.Email, user.Name)
	if err != nil {
		log.Printf("Error creating user: %v", err)
		return err
	}

	// Create JWT token
	token, err := h.tokenSvc.GenerateToken(dbUser.Id, dbUser.Email)
	if err != nil {
		log.Println("Error creating JWT:", err)
		return err
	}

	// Set cookie in writer
	http.SetCookie(writer, &http.Cookie{
		Name:     "session",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   h.env != "development",
	})

	return nil
}

// Get user from session data
func (h *gothService) GetUserFromSession(request *http.Request) (*model.User, error) {
	cookie, err := request.Cookie("session")
	if err != nil {
		log.Printf("Error getting cookie: %v", err)
		return nil, err
	}

	payload, err := h.tokenSvc.VerifyToken(cookie.Value)
	if err != nil {
		log.Printf("Error verifying token: %v", err)
		return nil, err
	}

	return h.userService.GetUserByIdAndEmail(request.Context(), payload.UserId.String(), payload.Email)
}
