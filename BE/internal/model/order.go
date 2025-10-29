package model

import (
	"time"
	"github.com/google/uuid"
)

type Order struct {
	ID              uuid.UUID `gorm:"type:char(36);primaryKey" json:"id"`
	UserID          uuid.UUID `gorm:"type:char(36);not null" json:"user_id"`
	ItemType        string    `gorm:"type:varchar(50)" json:"item_type"`
	ItemID          uuid.UUID `gorm:"type:char(36);not null" json:"item_id"`
	Amount          float64   `gorm:"type:decimal(10,2)" json:"amount"`
	Status          string    `gorm:"type:varchar(50);default:'pending'" json:"status"` 
	PaymentProofURL string    `gorm:"type:varchar(255)" json:"payment_proof_url"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`

	User User `gorm:"foreignKey:UserID"`
}