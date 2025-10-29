package handler

import (
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/model"
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/service"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type QuestionHandler struct {
	service  service.QuestionService
	validate *validator.Validate
}

func NewQuestionHandler(service service.QuestionService) *QuestionHandler {
	return &QuestionHandler{
		service:  service,
		validate: validator.New(),
	}
}

type QuestionRequest struct {
	TestID        uuid.UUID `json:"test_id" validate:"required"`
	QuestionText  string    `json:"question_text" validate:"required"`
	Options       string    `json:"options" validate:"required,json"`
	CorrectAnswer int       `json:"correct_answer" validate:"gte=0"`
	Explanation   string    `json:"explanation"`
}

func (h *QuestionHandler) CreateQuestion(c *fiber.Ctx) error {
	var req QuestionRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if err := h.validate.Struct(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Validation failed", "details": err.Error()})
	}

	question := &model.Question{
		TestID:        req.TestID,
		QuestionText:  req.QuestionText,
		Options:       req.Options,
		CorrectAnswer: req.CorrectAnswer,
		Explanation:   req.Explanation,
	}

	if err := h.service.CreateQuestion(question); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create question"})
	}
	return c.Status(fiber.StatusCreated).JSON(question)
}

func (h *QuestionHandler) GetQuestionsByTestID(c *fiber.Ctx) error {
	questions, err := h.service.GetQuestionsByTestID(c.Params("testId"))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve questions"})
	}
	return c.JSON(questions)
}

func (h *QuestionHandler) UpdateQuestion(c *fiber.Ctx) error {
	var req QuestionRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if err := h.validate.Struct(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Validation failed", "details": err.Error()})
	}

	questionData := &model.Question{
		TestID:        req.TestID,
		QuestionText:  req.QuestionText,
		Options:       req.Options,
		CorrectAnswer: req.CorrectAnswer,
		Explanation:   req.Explanation,
	}

	updatedQuestion, err := h.service.UpdateQuestion(c.Params("id"), questionData)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Question not found or could not be updated"})
	}
	return c.JSON(updatedQuestion)
}

func (h *QuestionHandler) DeleteQuestion(c *fiber.Ctx) error {
	if err := h.service.DeleteQuestion(c.Params("id")); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Question not found"})
	}
	return c.SendStatus(fiber.StatusNoContent)
}