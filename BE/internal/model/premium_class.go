package model

import (
	"time"
	"github.com/google/uuid"
)

type PremiumClass struct {
	ID          uuid.UUID `gorm:"type:char(36);primaryKey" json:"id"`
	Title       string    `gorm:"type:varchar(255);not null" json:"title"`
	Description string    `gorm:"type:text" json:"description"`
	Instructor  string    `gorm:"type:varchar(255)" json:"instructor"`
	Price       float64   `gorm:"type:decimal(10,2)" json:"price"`
	ImageURL    string    `gorm:"type:varchar(255)" json:"image_url"`
	Category    string    `gorm:"type:varchar(100)" json:"category"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}