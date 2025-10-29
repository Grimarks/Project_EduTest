package handler

import (
	"fmt"
	"path/filepath"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func UploadFile(c *fiber.Ctx) error {
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "File upload error: " + err.Error()})
	}

	ext := filepath.Ext(file.Filename)
	uniqueFilename := fmt.Sprintf("%s%s", uuid.New().String(), ext)

	savePath := fmt.Sprintf("./public/uploads/%s", uniqueFilename)

	if err := c.SaveFile(file, savePath); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save file"})
	}

	fileURL := fmt.Sprintf("/uploads/%s", uniqueFilename)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "File uploaded successfully",
		"url":     fileURL,
	})
}