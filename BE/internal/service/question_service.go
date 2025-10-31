package service

import (
	"errors" // <-- PASTIKAN "errors" DI-IMPORT
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/model"
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/repository"
	"github.com/google/uuid"
)

type QuestionService interface {
	CreateQuestion(question *model.Question) error
	GetQuestionsByTestID(testID string) ([]model.Question, error)
	GetQuestionByID(id string) (*model.Question, error) // <-- TAMBAHKAN BARIS INI
	UpdateQuestion(id string, questionData *model.Question) (*model.Question, error)
	DeleteQuestion(id string) error
}

type questionService struct {
	repo repository.QuestionRepository
}

func NewQuestionService(repo repository.QuestionRepository) QuestionService {
	return &questionService{repo}
}

func (s *questionService) CreateQuestion(question *model.Question) error {
	question.ID = uuid.New()
	return s.repo.Create(question)
}

func (s *questionService) GetQuestionsByTestID(testID string) ([]model.Question, error) {
	testUUID, err := uuid.Parse(testID)
	if err != nil {
		return nil, err
	}
	return s.repo.FindByTestID(testUUID)
}

// --- TAMBAHKAN FUNGSI BARU INI ---
func (s *questionService) GetQuestionByID(id string) (*model.Question, error) {
	questionUUID, err := uuid.Parse(id)
	if err != nil {
		return nil, errors.New("invalid id format")
	}
	return s.repo.FindByID(questionUUID)
}
// --- AKHIR FUNGSI BARU ---

func (s *questionService) UpdateQuestion(id string, questionData *model.Question) (*model.Question, error) {
	questionUUID, err := uuid.Parse(id)
	if err != nil {
		return nil, err
	}
	existingQuestion, err := s.repo.FindByID(questionUUID)
	if err != nil {
		return nil, err
	}

	existingQuestion.TestID = questionData.TestID // Pastikan TestID juga di-update
	existingQuestion.QuestionText = questionData.QuestionText
	existingQuestion.Options = questionData.Options
	existingQuestion.CorrectAnswer = questionData.CorrectAnswer
	existingQuestion.Explanation = questionData.Explanation

	err = s.repo.Update(existingQuestion)
	return existingQuestion, err
}

func (s *questionService) DeleteQuestion(id string) error {
	questionUUID, err := uuid.Parse(id)
	if err != nil {
		return err
	}
	return s.repo.Delete(questionUUID)
}