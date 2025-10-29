package handler

import (
	"os"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Ambil token dari cookie, BUKAN dari header
		tokenString := c.Cookies("access_token")
		if tokenString == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Missing access token"})
		}
		
		secretKey := os.Getenv("JWT_SECRET_KEY")

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fiber.NewError(fiber.StatusUnauthorized, "Unexpected signing method")
			}
			return []byte(secretKey), nil
		})

		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid or expired token"})
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token claims"})
		}

		c.Locals("userID", claims["user_id"])
		c.Locals("userRole", claims["role"])

		return c.Next()
	}
}

func AdminMiddleware() fiber.Handler {
    return func(c *fiber.Ctx) error {
        role, ok := c.Locals("userRole").(string)
        if !ok || role != "admin" {
            return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
                "error": "Access denied: requires admin privileges",
            })
        }
        return c.Next()
    }
}