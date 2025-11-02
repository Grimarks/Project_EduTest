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

    err := db.AutoMigrate(
        &model.User{},
        &model.Test{},
        &model.Question{},
        &model.TestResult{},
        &model.PremiumClass{},
        &model.Order{},
    )
    if err != nil {
        log.Fatal("Failed to migrate database:", err)
    }

    // Repository
    userRepo := repository.NewUserRepository(db)
    testRepo := repository.NewTestRepository(db)
    questionRepo := repository.NewQuestionRepository(db)
    testResultRepo := repository.NewTestResultRepository(db)
    premiumClassRepo := repository.NewPremiumClassRepository(db)
    orderRepo := repository.NewOrderRepository(db)

    // Service
    authService := service.NewAuthService(userRepo, redisClient)
    testService := service.NewTestService(testRepo)
    questionService := service.NewQuestionService(questionRepo)
    testResultService := service.NewTestResultService(testResultRepo, questionRepo)
    premiumClassService := service.NewPremiumClassService(premiumClassRepo)
    orderService := service.NewOrderService(orderRepo, userRepo)

    // Handler
    authHandler := handler.NewAuthHandler(authService)
    testHandler := handler.NewTestHandler(testService)
    questionHandler := handler.NewQuestionHandler(questionService)
    testResultHandler := handler.NewTestResultHandler(testResultService)
    premiumClassHandler := handler.NewPremiumClassHandler(premiumClassService)
    orderHandler := handler.NewOrderHandler(orderService)

    // App setup
    app := fiber.New()
    app.Use(logger.New())

    app.Use(cors.New(cors.Config{
        AllowOrigins:     "http://localhost:5173",
        AllowCredentials: true,
        AllowHeaders:     "Origin, Content-Type, Accept",
    }))

    app.Static("/uploads", "./public/uploads")

    api := app.Group("/api")

    // AUTH
    auth := api.Group("/auth")
    auth.Post("/register", authHandler.Register)
    auth.Post("/login", authHandler.Login)
    auth.Post("/refresh-token", authHandler.RefreshToken)
    auth.Get("/me", handler.AuthMiddleware(), authHandler.GetMe)
    auth.Post("/logout", handler.AuthMiddleware(), authHandler.Logout)

    // Grup admin untuk user management
    adminAuth := auth.Use(handler.AuthMiddleware(), handler.AdminMiddleware())
    adminAuth.Get("/users", authHandler.GetAllUsers)
    adminAuth.Put("/users/:id", authHandler.UpdateUser) // Tambahan dari versi benar

    // TESTS
    tests := api.Group("/tests")
    tests.Get("/", testHandler.GetAllTests)
    tests.Get("/:id", testHandler.GetTestByID)

    adminTests := tests.Use(handler.AuthMiddleware(), handler.AdminMiddleware())
    adminTests.Post("/", testHandler.CreateTest)
    adminTests.Put("/:id", testHandler.UpdateTest)
    adminTests.Delete("/:id", testHandler.DeleteTest)

    // QUESTIONS
    questions := api.Group("/questions")
    questions.Get("/test/:testId", questionHandler.GetQuestionsByTestID)
    questions.Get("/:id", handler.AuthMiddleware(), questionHandler.GetQuestionByID)

    adminQuestions := questions.Use(handler.AuthMiddleware(), handler.AdminMiddleware())
    adminQuestions.Post("/", questionHandler.CreateQuestion)
    adminQuestions.Put("/:id", questionHandler.UpdateQuestion)
    adminQuestions.Delete("/:id", questionHandler.DeleteQuestion)

    // TEST RESULTS
    results := api.Group("/test-results", handler.AuthMiddleware())
    results.Post("/", testResultHandler.SubmitTest)
    results.Get("/user/:userId", testResultHandler.GetResultsByUserID)

    // FILE UPLOAD
    api.Post("/upload", handler.AuthMiddleware(), handler.UploadFile)

    // PREMIUM CLASSES
    classes := api.Group("/premium-classes")
    classes.Get("/", premiumClassHandler.GetAllClasses)
    classes.Get("/:id", premiumClassHandler.GetClassByID)

    adminClasses := classes.Use(handler.AuthMiddleware(), handler.AdminMiddleware())
    adminClasses.Post("/", premiumClassHandler.CreateClass)
    adminClasses.Put("/:id", premiumClassHandler.UpdateClass)
    adminClasses.Delete("/:id", premiumClassHandler.DeleteClass)

    // ORDERS
    orders := api.Group("/orders", handler.AuthMiddleware())
    orders.Post("/", orderHandler.CreateOrder)
    orders.Get("/user/:userId", orderHandler.GetOrdersByUserID)
    orders.Put("/:id/payment-proof", orderHandler.UploadPaymentProof)
    orders.Put("/:id/verify", handler.AdminMiddleware(), orderHandler.VerifyOrder)
    orders.Get("/", handler.AdminMiddleware(), orderHandler.GetAllOrders)

    log.Fatal(app.Listen(":3000"))
}
