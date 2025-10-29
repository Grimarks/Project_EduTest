package handler

import (
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/service"
	"github.com/gofiber/fiber/v2"
)

type TestResultHandler struct {
	service service.TestResultService
}

func NewTestResultHandler(service service.TestResultService) *TestResultHandler {
	return &TestResultHandler{service}
}

func (h *TestResultHandler) SubmitTest(c *fiber.Ctx) error {
	userID, _ := c.Locals("userID").(string)

	var req service.SubmitTestRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	result, err := h.service.SubmitTest(userID, &req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(result)
}

func (h *TestResultHandler) GetResultsByUserID(c *fiber.Ctx) error {
	userID := c.Params("userId")

	loggedInUserID, _ := c.Locals("userID").(string)
	userRole, _ := c.Locals("userRole").(string)
	if userRole != "admin" && loggedInUserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Access denied"})
	}

	results, err := h.service.GetResultsByUserID(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not retrieve results"})
	}

	return c.JSON(results)
}