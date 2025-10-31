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
    "github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
    db := config.InitDatabase()
    redisClient := config.InitRedis()

    err := db.AutoMigrate(&model.User{}, &model.Test{}, &model.Question{}, &model.TestResult{}, &model.PremiumClass{}, &model.Order{})
    if err != nil {
        log.Fatal("Failed to migrate database:", err)
    }

    userRepo := repository.NewUserRepository(db)
    authService := service.NewAuthService(userRepo, redisClient)
    authHandler := handler.NewAuthHandler(authService)

    testRepo := repository.NewTestRepository(db)
    testService := service.NewTestService(testRepo)
    testHandler := handler.NewTestHandler(testService)

    questionRepo := repository.NewQuestionRepository(db)
    questionService := service.NewQuestionService(questionRepo)
    questionHandler := handler.NewQuestionHandler(questionService)

    testResultRepo := repository.NewTestResultRepository(db)
    testResultService := service.NewTestResultService(testResultRepo, questionRepo)
    testResultHandler := handler.NewTestResultHandler(testResultService)

    premiumClassRepo := repository.NewPremiumClassRepository(db)
    premiumClassService := service.NewPremiumClassService(premiumClassRepo)
    premiumClassHandler := handler.NewPremiumClassHandler(premiumClassService)

    orderRepo := repository.NewOrderRepository(db)
    orderService := service.NewOrderService(orderRepo, userRepo)
    orderHandler := handler.NewOrderHandler(orderService)

    app := fiber.New()
    app.Use(logger.New())

    app.Use(cors.New(cors.Config{
        AllowOrigins:     "http://localhost:5173",
        AllowCredentials: true,
        AllowHeaders:     "Origin, Content-Type, Accept",
    }))

    app.Static("/uploads", "./public/uploads")

    api := app.Group("/api")
    auth := api.Group("/auth")

    auth.Post("/register", authHandler.Register)
    auth.Post("/login", authHandler.Login)
    auth.Post("/refresh-token", authHandler.RefreshToken)
    auth.Get("/me", handler.AuthMiddleware(), authHandler.GetMe)
    auth.Post("/logout", handler.AuthMiddleware(), authHandler.Logout)
    auth.Get("/users", handler.AuthMiddleware(), handler.AdminMiddleware(), authHandler.GetAllUsers)

    tests := api.Group("/tests")
    tests.Get("/", testHandler.GetAllTests)
    tests.Get("/:id", testHandler.GetTestByID)

    adminTests := tests.Use(handler.AuthMiddleware(), handler.AdminMiddleware())
    adminTests.Post("/", testHandler.CreateTest)
    adminTests.Put("/:id", testHandler.UpdateTest)
    adminTests.Delete("/:id", testHandler.DeleteTest)

    questions := api.Group("/questions")
    questions.Get("/test/:testId", questionHandler.GetQuestionsByTestID)
    questions.Get("/:id", handler.AuthMiddleware(), questionHandler.GetQuestionByID)

    adminQuestions := questions.Use(handler.AuthMiddleware(), handler.AdminMiddleware())
    adminQuestions.Post("/", questionHandler.CreateQuestion)
    adminQuestions.Put("/:id", questionHandler.UpdateQuestion)
    adminQuestions.Delete("/:id", questionHandler.DeleteQuestion)

    results := api.Group("/test-results", handler.AuthMiddleware())
    results.Post("/", testResultHandler.SubmitTest)
    results.Get("/user/:userId", testResultHandler.GetResultsByUserID)

    api.Post("/upload", handler.AuthMiddleware(), handler.UploadFile)

    classes := api.Group("/premium-classes")
    classes.Get("/", premiumClassHandler.GetAllClasses)
    classes.Get("/:id", premiumClassHandler.GetClassByID)

    adminClasses := classes.Use(handler.AuthMiddleware(), handler.AdminMiddleware())
    adminClasses.Post("/", premiumClassHandler.CreateClass)
    adminClasses.Put("/:id", premiumClassHandler.UpdateClass)
    adminClasses.Delete("/:id", premiumClassHandler.DeleteClass)

    orders := api.Group("/orders", handler.AuthMiddleware())
    orders.Post("/", orderHandler.CreateOrder)
    orders.Get("/user/:userId", orderHandler.GetOrdersByUserID)
    orders.Put("/:id/payment-proof", orderHandler.UploadPaymentProof)
    orders.Put("/:id/verify", handler.AdminMiddleware(), orderHandler.VerifyOrder)
    orders.Get("/", handler.AdminMiddleware(), orderHandler.GetAllOrders)

    log.Fatal(app.Listen(":3000"))
}
