package repository

import (
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type QuestionRepository interface {
	Create(question *model.Question) error
	FindByTestID(testID uuid.UUID) ([]model.Question, error)
	FindByID(id uuid.UUID) (*model.Question, error)
	Update(question *model.Question) error
	Delete(id uuid.UUID) error
}

type questionRepository struct {
	db *gorm.DB
}

func NewQuestionRepository(db *gorm.DB) QuestionRepository {
	return &questionRepository{db}
}

func (r *questionRepository) Create(question *model.Question) error {
	return r.db.Create(question).Error
}

func (r *questionRepository) FindByTestID(testID uuid.UUID) ([]model.Question, error) {
	var questions []model.Question
	err := r.db.Where("test_id = ?", testID).Find(&questions).Error
	return questions, err
}

func (r *questionRepository) FindByID(id uuid.UUID) (*model.Question, error) {
	var question model.Question
	err := r.db.First(&question, "id = ?", id).Error
	return &question, err
}

func (r *questionRepository) Update(question *model.Question) error {
	return r.db.Save(question).Error
}

func (r *questionRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&model.Question{}, "id = ?", id).Error
}