package service

import (
	"encoding/json"
	"errors"
	"time"

	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/model"
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/repository"
	"github.com/google/uuid"
)

type UserAnswer struct {
	QuestionID     string `json:"question_id"`
	SelectedAnswer int    `json:"selected_answer"`
}

type SubmitTestRequest struct {
	TestID    string       `json:"test_id"`
	TimeSpent int          `json:"time_spent"`
	Answers   []UserAnswer `json:"answers"`
}

type TestResultService interface {
	SubmitTest(userID string, submission *SubmitTestRequest) (*model.TestResult, error)
	GetResultsByUserID(userID string) ([]model.TestResult, error)
}

type testResultService struct {
	resultRepo   repository.TestResultRepository
	questionRepo repository.QuestionRepository
}

func NewTestResultService(resultRepo repository.TestResultRepository, questionRepo repository.QuestionRepository) TestResultService {
	return &testResultService{resultRepo, questionRepo}
}

func (s *testResultService) SubmitTest(userID string, submission *SubmitTestRequest) (*model.TestResult, error) {
	userUUID, _ := uuid.Parse(userID)
	testUUID, _ := uuid.Parse(submission.TestID)

	correctAnswersMap := make(map[uuid.UUID]int)
	questions, err := s.questionRepo.FindByTestID(testUUID)
	if err != nil {
		return nil, errors.New("could not retrieve questions for the test")
	}
	for _, q := range questions {
		correctAnswersMap[q.ID] = q.CorrectAnswer
	}

	var correctCount int
	totalQuestions := len(questions)
	for _, userAnswer := range submission.Answers {
		questionUUID, _ := uuid.Parse(userAnswer.QuestionID)
		if correctAnswer, ok := correctAnswersMap[questionUUID]; ok {
			if userAnswer.SelectedAnswer == correctAnswer {
				correctCount++
			}
		}
	}

	score := 0.0
	if totalQuestions > 0 {
		score = (float64(correctCount) / float64(totalQuestions)) * 100
	}

	userAnswersJSON, _ := json.Marshal(submission.Answers)

	result := &model.TestResult{
		ID:             uuid.New(),
		TestID:         testUUID,
		UserID:         userUUID,
		Score:          score,
		TotalQuestions: totalQuestions,
		CorrectAnswers: correctCount,
		TimeSpent:      submission.TimeSpent,
		Answers:        string(userAnswersJSON),
		CompletedAt:    time.Now(),
	}

	if err := s.resultRepo.Create(result); err != nil {
		return nil, err
	}
	return result, nil
}

func (s *testResultService) GetResultsByUserID(userID string) ([]model.TestResult, error) {
	userUUID, err := uuid.Parse(userID)
	if err != nil {
		return nil, errors.New("invalid user ID format")
	}
	return s.resultRepo.FindByUserID(userUUID)
}