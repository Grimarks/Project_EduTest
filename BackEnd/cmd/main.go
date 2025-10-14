package main

import (
	"log"

	"github.com/Grimarks/Project-TryOutOnline-GDGoC/config"
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/handler"
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/model"
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/repository"
	"github.com/Grimarks/Project-TryOutOnline-GDGoC/internal/service"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	db := config.InitDatabase()

	err := db.AutoMigrate(&model.User{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	userRepo := repository.NewUserRepository(db)
	authService := service.NewAuthService(userRepo)
	authHandler := handler.NewAuthHandler(authService)

	app := fiber.New()
	app.Use(logger.New())

	api := app.Group("/api")
	auth := api.Group("/auth")

	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)

	log.Fatal(app.Listen(":3000"))
}