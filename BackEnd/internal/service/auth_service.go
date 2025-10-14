package service

import (
	"errors"

	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/model"
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/repository"
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/pkg/jwt"
	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	Register(user *model.User) error
	Login(email, password string) (string, string, error)
}

type authService struct {
	userRepo repository.UserRepository
}

func NewAuthService(userRepo repository.UserRepository) AuthService {
	return &authService{userRepo: userRepo}
}

func (s *authService) Register(user *model.User) error {
	return s.userRepo.CreateUser(user)
}

func (s *authService) Login(email, password string) (string, string, error) {
	user, err := s.userRepo.FindUserByEmail(email)
	if err != nil {
		return "", "", errors.New("invalid email or password")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		return "", "", errors.New("invalid email or password")
	}

	accessToken, refreshToken, err := jwt.GenerateTokens(user.ID, user.Role)
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}