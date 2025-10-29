package model

import (
	"github.com/google/uuid"
)

type Question struct {
    // TAMBAHKAN TAG JSON DI SINI
	ID             uuid.UUID `gorm:"type:char(36);primaryKey" json:"id"`
	TestID         uuid.UUID `gorm:"type:char(36);not null"   json:"test_id"`
	QuestionText   string    `gorm:"type:text;not null"      json:"question_text"`
	Options        string    `gorm:"type:json"               json:"options"`
	CorrectAnswer  int       `                               json:"correct_answer"`
	Explanation    string    `gorm:"type:text"               json:"explanation"`
	
	Test           Test `gorm:"foreignKey:TestID" json:"-"`
}