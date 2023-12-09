package main

import (
	"database/sql"
	"fmt"
	"log"
	"log/slog"
	"os"

	_ "github.com/lib/pq"

	"github.com/yuki0920/company-ranking/go/logger"
	"github.com/yuki0920/company-ranking/go/models"
	"github.com/yuki0920/company-ranking/go/server"
)

func main() {
	log.Fatal(initServer())
}

func initServer() error {
	// setup logger
	env := os.Getenv("ENV")
	logger := logger.NewLogger(env)
	defer func() {
		_ = logger.Sync()
	}()

	handler := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{})
	slogLogger := slog.New(handler)

	dbLogger := func(s string, v ...any) {
		slogLogger.Info(
			"Query Executed",
			slog.String("Query", s),
			slog.Any("Value", v),
		)
	}

	dbErrLogger := func(s string, v ...any) {
		msg := fmt.Sprintf(s, v)
		slogLogger.Error(
			"Query Error",
			slog.String("message", msg),
		)
	}
	models.SetLogger(dbLogger)
	models.SetErrorLogger(dbErrLogger)

	// setup db
	databaseURL := os.Getenv("DATABASE_URL")
	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		panic(err)
	}
	defer db.Close()
	logger.Info("Connected to database")

	// setup server
	s := server.NewServer(db, logger)
	frontURL := os.Getenv("FRONT_URL")
	s.MountHandlers(frontURL)
	// NOTE: API_HOST is for local development, don't change this.
	apiHost := os.Getenv("API_HOST")
	// NOTE: Heroku provides the port to bind to $PORT, don't change this.
	apiPort := os.Getenv("PORT")
	addr := fmt.Sprintf("%s:%s", apiHost, apiPort)

	return s.StartServer(addr)
}
