package repository

import (
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type OrderRepository interface {
	Create(order *model.Order) error
	FindByID(id uuid.UUID) (*model.Order, error)
	Update(order *model.Order) error
	FindByUserID(userID uuid.UUID) ([]model.Order, error)
	FindAll() ([]model.Order, error) // <-- DITAMBAHKAN
}

type orderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) OrderRepository {
	return &orderRepository{db}
}

func (r *orderRepository) Create(order *model.Order) error {
	return r.db.Create(order).Error
}

func (r *orderRepository) FindByID(id uuid.UUID) (*model.Order, error) {
	var order model.Order
	err := r.db.First(&order, "id = ?", id).Error
	return &order, err
}

func (r *orderRepository) Update(order *model.Order) error {
	return r.db.Save(order).Error
}

func (r *orderRepository) FindByUserID(userID uuid.UUID) ([]model.Order, error) {
	var orders []model.Order
	err := r.db.Where("user_id = ?", userID).Find(&orders).Error
	return orders, err
}

func (r *orderRepository) FindAll() ([]model.Order, error) {
	var orders []model.Order
	err := r.db.Preload("User").Order("created_at desc").Find(&orders).Error
	return orders, err
}
