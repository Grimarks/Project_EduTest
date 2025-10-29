package model

import (
    "time"
    "github.com/google/uuid"
)

type Test struct {
    ID          uuid.UUID `gorm:"type:char(36);primaryKey"`
    Title       string    `gorm:"type:varchar(255);not null"`
    Description string    `gorm:"type:text"`
    Category    string    `gorm:"type:varchar(100)"`
    Difficulty  string    `gorm:"type:varchar(50)"` 
    Duration    int       
    IsPremium   bool      `gorm:"default:false"`
    ImageURL    string    `gorm:"type:varchar(255)"`
    CreatedAt   time.Time
    UpdatedAt   time.Time
}