package repository

import (
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/model"
	"gorm.io/gorm"
	"github.com/google/uuid"
)

type UserRepository interface {
	CreateUser(user *model.User) error
	FindUserByEmail(email string) (*model.User, error)
	FindUserByID(userID uuid.UUID) (*model.User, error)
	UpdatePremiumStatus(userID uuid.UUID, isPremium bool) error
	FindAllUsers() ([]model.User, error)
	UpdateUser(user *model.User) error // <-- TAMBAHKAN INI
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) CreateUser(user *model.User) error {
	return r.db.Create(user).Error
}

func (r *userRepository) FindUserByEmail(email string) (*model.User, error) {
	var user model.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) FindUserByID(userID uuid.UUID) (*model.User, error) {
	var user model.User
	err := r.db.Where("id = ?", userID).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) UpdatePremiumStatus(userID uuid.UUID, isPremium bool) error {
	return r.db.Model(&model.User{}).Where("id = ?", userID).Update("is_premium", isPremium).Error
}

func (r *userRepository) FindAllUsers() ([]model.User, error) {
	var users []model.User
	err := r.db.Order("created_at desc").Find(&users).Error
	return users, err
}

func (r *userRepository) UpdateUser(user *model.User) error {
	return r.db.Save(user).Error
}