package model

import (
    "time"
    "github.com/google/uuid"
)

type Test struct {
    ID          uuid.UUID `gorm:"type:char(36);primaryKey" json:"id"`
    Title       string    `gorm:"type:varchar(255);not null" json:"title"`
    Description string    `gorm:"type:text" json:"description"`
    Category    string    `gorm:"type:varchar(100)" json:"category"`
    Difficulty  string    `gorm:"type:varchar(50)" json:"difficulty"`
    Duration    int       `json:"duration"`
    IsPremium   bool      `gorm:"default:false" json:"is_premium"`
    ImageURL    string    `gorm:"type:varchar(255)" json:"image_url"`
    CreatedAt   time.Time `json:"created_at"`
    UpdatedAt   time.Time `json:"updated_at"`
    Questions   []Question `gorm:"foreignKey:TestID" json:"questions"`
}