package service

import (
	"errors"
	"time"

	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/model"
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/repository"
	"github.com/google/uuid"
)

type OrderService interface {
	CreateOrder(userID string, req *CreateOrderRequest) (*model.Order, error)
	UploadPaymentProof(orderID, fileURL string) (*model.Order, error)
	VerifyOrder(orderID string) error
	GetOrdersByUserID(userID string) ([]model.Order, error)
	GetAllOrders() ([]model.Order, error) // untuk admin
}

type orderService struct {
	orderRepo repository.OrderRepository
	userRepo  repository.UserRepository
}

func NewOrderService(orderRepo repository.OrderRepository, userRepo repository.UserRepository) OrderService {
	return &orderService{orderRepo, userRepo}
}

// DTO pembuatan order
type CreateOrderRequest struct {
	ItemType string  `json:"item_type" validate:"required"`     // "test", "premium_monthly", "premium_yearly"
	ItemID   string  `json:"item_id" validate:"required,uuid"`
	Amount   float64 `json:"amount" validate:"required,gt=0"`
}

// Membuat order baru
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

// Upload bukti pembayaran
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

// Verifikasi order dan aktifkan premium
func (s *orderService) VerifyOrder(orderID string) error {
	orderUUID, err := uuid.Parse(orderID)
	if err != nil {
		return errors.New("invalid order id format")
	}

	order, err := s.orderRepo.FindByID(orderUUID)
	if err != nil {
		return errors.New("order not found")
	}

	// --- LOGIKA BARU ---
	// 1. Dapatkan user
	user, err := s.userRepo.FindUserByID(order.UserID)
	if err != nil {
		return errors.New("user not found for this order")
	}

	// 2. Tentukan tanggal kedaluwarsa
	expiresAt := time.Now()
	if order.ItemType == "premium_monthly" {
		expiresAt = time.Now().AddDate(0, 1, 0) // 1 bulan
	} else if order.ItemType == "premium_yearly" {
		expiresAt = time.Now().AddDate(1, 0, 0) // 1 tahun
	} else {
		// fallback (akses lama)
		expiresAt = time.Now().AddDate(100, 0, 0)
	}

	// 3. Update user
	user.IsPremium = true
	user.PremiumExpiresAt = &expiresAt

	if err := s.userRepo.UpdateUser(user); err != nil {
		return err
	}

	// 4. Update status order
	order.Status = "completed"
	if err := s.orderRepo.Update(order); err != nil {
		return err
	}
	// --- AKHIR LOGIKA BARU ---

	return nil
}

// Dapatkan semua order milik user
func (s *orderService) GetOrdersByUserID(userID string) ([]model.Order, error) {
	userUUID, err := uuid.Parse(userID)
	if err != nil {
		return nil, errors.New("invalid user id format")
	}
	return s.orderRepo.FindByUserID(userUUID)
}

// --- Untuk admin ---
func (s *orderService) GetAllOrders() ([]model.Order, error) {
	return s.orderRepo.FindAll()
}
