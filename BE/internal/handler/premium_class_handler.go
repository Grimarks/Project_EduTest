package handler

import (
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/service"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type PremiumClassHandler struct {
	service  service.PremiumClassService
	validate *validator.Validate
}

func NewPremiumClassHandler(service service.PremiumClassService) *PremiumClassHandler {
	return &PremiumClassHandler{
		service:  service,
		validate: validator.New(),
	}
}

func (h *PremiumClassHandler) CreateClass(c *fiber.Ctx) error {
	var req service.CreateClassRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	if err := h.validate.Struct(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	class, err := h.service.CreateClass(&req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create class"})
	}

	return c.Status(fiber.StatusCreated).JSON(class)
}

func (h *PremiumClassHandler) GetAllClasses(c *fiber.Ctx) error {
	classes, err := h.service.GetAllClasses()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve classes"})
	}
	return c.JSON(classes)
}

func (h *PremiumClassHandler) GetClassByID(c *fiber.Ctx) error {
	class, err := h.service.GetClassByID(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(class)
}

func (h *PremiumClassHandler) UpdateClass(c *fiber.Ctx) error {
	var req service.UpdateClassRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	if err := h.validate.Struct(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	updatedClass, err := h.service.UpdateClass(c.Params("id"), &req)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(updatedClass)
}

func (h *PremiumClassHandler) DeleteClass(c *fiber.Ctx) error {
	if err := h.service.DeleteClass(c.Params("id")); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": err.Error()})
	}
	return c.SendStatus(fiber.StatusNoContent)
}