package model

import (
	"time"
	"github.com/google/uuid"
)

type TestResult struct {
	ID             uuid.UUID `gorm:"type:char(36);primaryKey" json:"id"`
	TestID         uuid.UUID `gorm:"type:char(36);not null"   json:"test_id"`
	UserID         uuid.UUID `gorm:"type:char(36);not null"   json:"user_id"`
	Score          float64   `gorm:"type:decimal(5,2)"        json:"score"`
	TotalQuestions int       `                                json:"total_questions"`
	CorrectAnswers int       `                                json:"correct_answers"`
	TimeSpent      int       `                                json:"time_spent"`
	Answers        string    `gorm:"type:json"                json:"answers"`    
	CompletedAt    time.Time `                                json:"completed_at"`

	User User `gorm:"foreignKey:UserID"`
	Test Test `gorm:"foreignKey:TestID"`
}