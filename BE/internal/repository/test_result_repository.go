package repository

import (
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TestResultRepository interface {
	Create(result *model.TestResult) error
	FindByUserID(userID uuid.UUID) ([]model.TestResult, error)
}

type testResultRepository struct {
	db *gorm.DB
}

func NewTestResultRepository(db *gorm.DB) TestResultRepository {
	return &testResultRepository{db}
}

func (r *testResultRepository) Create(result *model.TestResult) error {
	return r.db.Create(result).Error
}

func (r *testResultRepository) FindByUserID(userID uuid.UUID) ([]model.TestResult, error) {
	var results []model.TestResult
	err := r.db.Preload("Test").Where("user_id = ?", userID).Find(&results).Error
	return results, err
}