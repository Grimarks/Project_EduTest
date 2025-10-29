package handler

import (
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/model"
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/service"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type TestHandler struct {
	service  service.TestService
	validate *validator.Validate
}

func NewTestHandler(service service.TestService) *TestHandler {
	return &TestHandler{
		service:  service,
		validate: validator.New(),
	}
}

type TestRequest struct {
	Title       string `json:"title" validate:"required,min=5"`
	Description string `json:"description"`
	Category    string `json:"category" validate:"required"`
	Difficulty  string `json:"difficulty" validate:"required"`
	Duration    int    `json:"duration" validate:"required,gt=0"`
	IsPremium   bool   `json:"is_premium"`
	ImageURL    string `json:"image_url" validate:"omitempty,url"`
}

func (h *TestHandler) CreateTest(c *fiber.Ctx) error {
	var req TestRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if err := h.validate.Struct(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Validation failed", "details": err.Error()})
	}

	test := &model.Test{
		Title:       req.Title,
		Description: req.Description,
		Category:    req.Category,
		Difficulty:  req.Difficulty,
		Duration:    req.Duration,
		IsPremium:   req.IsPremium,
		ImageURL:    req.ImageURL,
	}

	if err := h.service.CreateTest(test); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create test"})
	}

	return c.Status(fiber.StatusCreated).JSON(test)
}

func (h *TestHandler) GetAllTests(c *fiber.Ctx) error {
	tests, err := h.service.GetAllTests()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve tests"})
	}
	return c.JSON(tests)
}

func (h *TestHandler) GetTestByID(c *fiber.Ctx) error {
	test, err := h.service.GetTestByID(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Test not found"})
	}
	return c.JSON(test)
}

func (h *TestHandler) UpdateTest(c *fiber.Ctx) error {
	var req TestRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if err := h.validate.Struct(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Validation failed", "details": err.Error()})
	}

	testData := &model.Test{
		Title:       req.Title,
		Description: req.Description,
		Category:    req.Category,
		Difficulty:  req.Difficulty,
		Duration:    req.Duration,
		IsPremium:   req.IsPremium,
		ImageURL:    req.ImageURL,
	}

	updatedTest, err := h.service.UpdateTest(c.Params("id"), testData)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Test not found or could not be updated"})
	}
	return c.JSON(updatedTest)
}

func (h *TestHandler) DeleteTest(c *fiber.Ctx) error {
	if err := h.service.DeleteTest(c.Params("id")); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Test not found"})
	}
	return c.SendStatus(fiber.StatusNoContent)
}