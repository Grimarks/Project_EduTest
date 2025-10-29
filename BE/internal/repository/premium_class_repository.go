package repository

import (
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PremiumClassRepository interface {
	Create(class *model.PremiumClass) error
	FindAll() ([]model.PremiumClass, error)
	FindByID(id uuid.UUID) (*model.PremiumClass, error)
	Update(class *model.PremiumClass) error
	Delete(id uuid.UUID) error
}

type premiumClassRepository struct {
	db *gorm.DB
}

func NewPremiumClassRepository(db *gorm.DB) PremiumClassRepository {
	return &premiumClassRepository{db}
}

func (r *premiumClassRepository) Create(class *model.PremiumClass) error {
	return r.db.Create(class).Error
}

// IMPLEMENTASI LENGKAP DIMULAI DI SINI

func (r *premiumClassRepository) FindAll() ([]model.PremiumClass, error) {
	var classes []model.PremiumClass
	err := r.db.Find(&classes).Error
	return classes, err
}

func (r *premiumClassRepository) FindByID(id uuid.UUID) (*model.PremiumClass, error) {
	var class model.PremiumClass
	err := r.db.First(&class, "id = ?", id).Error
	return &class, err
}

func (r *premiumClassRepository) Update(class *model.PremiumClass) error {
	return r.db.Save(class).Error
}

func (r *premiumClassRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&model.PremiumClass{}, "id = ?", id).Error
}