package config

import (
	"context"
	"log"
	"os"
	"strconv"
	"github.com/go-redis/redis/v8"
)

var Ctx = context.Background()

func InitRedis() *redis.Client {
	db, _ := strconv.Atoi(os.Getenv("REDIS_DB"))

	rdb := redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_ADDR"),
		Password: os.Getenv("REDIS_PASSWORD"),
		DB:       db,
	})

	if err := rdb.Ping(Ctx).Err(); err != nil {
		log.Fatal("Failed to connect to Redis:", err)
	}

	log.Println("Redis connection successful.")
	return rdb
}