package service

import (
	"errors"

	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/model"
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/repository"
	"github.com/google/uuid"
)

type OrderService interface {
	CreateOrder(userID string, req *CreateOrderRequest) (*model.Order, error)
	UploadPaymentProof(orderID, fileURL string) (*model.Order, error)
	VerifyOrder(orderID string) error
	GetOrdersByUserID(userID string) ([]model.Order, error)
	GetAllOrders() ([]model.Order, error) // <-- DITAMBAHKAN
}

type orderService struct {
	orderRepo repository.OrderRepository
	userRepo  repository.UserRepository // Service ini butuh akses ke repo user
}

func NewOrderService(orderRepo repository.OrderRepository, userRepo repository.UserRepository) OrderService {
	return &orderService{orderRepo, userRepo}
}

// DTO untuk request pembuatan order
type CreateOrderRequest struct {
	ItemType string  `json:"item_type" validate:"required"`     // "test" atau "class"
	ItemID   string  `json:"item_id" validate:"required,uuid"`
	Amount   float64 `json:"amount" validate:"required,gt=0"`
}

// Fungsi Kunci 1: Membuat Order
func (s *orderService) CreateOrder(userID string, req *CreateOrderRequest) (*model.Order, error) {
	userUUID, err := uuid.Parse(userID)
	if err != nil {
		return nil, errors.New("invalid user id format")
	}
	itemUUID, err := uuid.Parse(req.ItemID)
	if err != nil {
		return nil, errors.New("invalid item id format")
	}

	order := &model.Order{
		ID:       uuid.New(),
		UserID:   userUUID,
		ItemType: req.ItemType,
		ItemID:   itemUUID,
		Amount:   req.Amount,
		Status:   "pending",
	}

	if err := s.orderRepo.Create(order); err != nil {
		return nil, err
	}
	return order, nil
}

func (s *orderService) UploadPaymentProof(orderID, fileURL string) (*model.Order, error) {
	orderUUID, err := uuid.Parse(orderID)
	if err != nil {
		return nil, errors.New("invalid order id format")
	}
	order, err := s.orderRepo.FindByID(orderUUID)
	if err != nil {
		return nil, errors.New("order not found")
	}

	order.PaymentProofURL = fileURL
	if err := s.orderRepo.Update(order); err != nil {
		return nil, err
	}
	return order, nil
}

func (s *orderService) VerifyOrder(orderID string) error {
	orderUUID, err := uuid.Parse(orderID)
	if err != nil {
		return errors.New("invalid order id format")
	}
	order, err := s.orderRepo.FindByID(orderUUID)
	if err != nil {
		return errors.New("order not found")
	}

	order.Status = "completed"
	if err := s.orderRepo.Update(order); err != nil {
		return err
	}

	if err := s.userRepo.UpdatePremiumStatus(order.UserID, true); err != nil {
		return err
	}
	return nil
}

func (s *orderService) GetOrdersByUserID(userID string) ([]model.Order, error) {
	userUUID, err := uuid.Parse(userID)
	if err != nil {
		return nil, errors.New("invalid user id format")
	}
	return s.orderRepo.FindByUserID(userUUID)
}

// --- FUNGSI BARU UNTUK ADMIN MELIHAT SEMUA ORDER ---
func (s *orderService) GetAllOrders() ([]model.Order, error) {
	return s.orderRepo.FindAll()
}
