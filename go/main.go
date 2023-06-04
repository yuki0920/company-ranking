package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"

	"github.com/yuki0920/company-ranking/go/models"
	"github.com/yuki0920/company-ranking/go/server"
)

func main() {
	// setup logger
	env := os.Getenv("ENV")

	var zapConfig zap.Config
	if env == "production" {
		zapConfig = zap.NewProductionConfig()
	} else {
		zapConfig := zap.NewDevelopmentConfig()
		zapConfig.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
	}
	zapConfig = zap.NewDevelopmentConfig()
	zapConfig.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder

	logger, _ := zapConfig.Build()
	defer func() {
		_ = logger.Sync()
	}()

	dbLogger := func(s string, v ...any) {
		logger.Info(
			"Query Executed",
			zap.String("Query", s),
			zap.Any("Value", v),
		)
	}
	dbErrLogger := func(s string, v ...any) {
		msg := fmt.Sprintf(s, v)
		logger.Error(
			"Query Error",
			zap.String("message", msg),
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

	log.Fatal(s.StartServer(addr))
}
