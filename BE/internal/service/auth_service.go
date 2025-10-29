package service

import (
	"context"
	"errors"
	"time"

	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/model"
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/repository"
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/pkg/jwt"
	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	Register(user *model.User) error
	Login(email, password string) (string, string, error)
	GetMe(userID string) (*model.User, error)
	Logout(userID string) error
	GetRedisToken(userID string) (string, error)
}

type authService struct {
	userRepo    repository.UserRepository
	redisClient *redis.Client
}

func NewAuthService(userRepo repository.UserRepository, redisClient *redis.Client) AuthService {
	return &authService{
		userRepo:    userRepo,
		redisClient: redisClient,
	}
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

	err = s.redisClient.Set(context.Background(), user.ID.String(), refreshToken, time.Hour*24*7).Err()
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

func (s *authService) GetMe(userID string) (*model.User, error) {
	userUUID, err := uuid.Parse(userID)
	if err != nil {
		return nil, errors.New("invalid user ID format")
	}
	return s.userRepo.FindUserByID(userUUID)
}

func (s *authService) Logout(userID string) error {
	return s.redisClient.Del(context.Background(), userID).Err()
}

func (s *authService) GetRedisToken(userID string) (string, error) {
	val, err := s.redisClient.Get(context.Background(), userID).Result()
	if err != nil {
		return "", err
	}
	return val, nil
}