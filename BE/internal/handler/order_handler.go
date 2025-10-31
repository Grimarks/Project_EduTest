package handler

import (
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/service"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type OrderHandler struct {
	service  service.OrderService
	validate *validator.Validate
}

func NewOrderHandler(service service.OrderService) *OrderHandler {
	return &OrderHandler{
		service:  service,
		validate: validator.New(),
	}
}

func (h *OrderHandler) CreateOrder(c *fiber.Ctx) error {
	userID, _ := c.Locals("userID").(string)
	var req service.CreateOrderRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	if err := h.validate.Struct(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	order, err := h.service.CreateOrder(userID, &req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusCreated).JSON(order)
}

type UploadProofRequest struct {
	URL string `json:"url" validate:"required,url"`
}

func (h *OrderHandler) UploadPaymentProof(c *fiber.Ctx) error {
	orderID := c.Params("id")
	var req UploadProofRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	if err := h.validate.Struct(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	order, err := h.service.UploadPaymentProof(orderID, req.URL)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(order)
}

func (h *OrderHandler) VerifyOrder(c *fiber.Ctx) error {
	orderID := c.Params("id")
	if err := h.service.VerifyOrder(orderID); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"message": "Order verified and user granted premium access"})
}

func (h *OrderHandler) GetOrdersByUserID(c *fiber.Ctx) error {
	targetUserID := c.Params("userId")
	loggedInUserID, _ := c.Locals("userID").(string)
	userRole, _ := c.Locals("userRole").(string)

	if userRole != "admin" && loggedInUserID != targetUserID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Access denied"})
	}

	orders, err := h.service.GetOrdersByUserID(targetUserID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(orders)
}

// --- FUNGSI BARU UNTUK ADMIN MELIHAT SEMUA ORDER ---
func (h *OrderHandler) GetAllOrders(c *fiber.Ctx) error {
	// Cek apakah user admin (meskipun sudah dicek di middleware, ini best practice)
	userRole, _ := c.Locals("userRole").(string)
	if userRole != "admin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Access denied"})
	}

	orders, err := h.service.GetAllOrders()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(orders)
}
