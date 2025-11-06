package model

import (
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	ID           uuid.UUID  `gorm:"type:char(36);primaryKey" json:"id"`
	Name         string     `gorm:"type:varchar(255);not null" json:"name"`
	Email        string     `gorm:"type:varchar(255);unique;not null" json:"email"`
	PasswordHash string     `gorm:"type:varchar(255);not null" json:"-"`
	IsPremium    bool       `gorm:"default:false" json:"is_premium"`
	PremiumExpiresAt *time.Time `gorm:"null" json:"premium_expires_at,omitempty"`
	Role         string     `gorm:"type:varchar(50);default:'user'" json:"role"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	u.ID = uuid.New()

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.PasswordHash), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.PasswordHash = string(hashedPassword)
	return
}