package main

import (
	"context"
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/yuki0920/company-ranking/go/models"
)

func main() {
	logger, _ := zap.NewProduction()
	defer logger.Sync()
	dbLogger := func(s string, v ...any) {
		logger.Info(
			"Query Executed",
			zap.String("Query", s),
			zap.Any("Value", v),
		)
	}

	models.SetLogger(dbLogger)

	databaseURL := os.Getenv("POSTGRES_DATABASE_URL")
	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	sec, err := models.SecurityByCode(context.Background(), db, 9997)
	if err != nil {
		panic(err)
	}
	fmt.Println(sec)
}
