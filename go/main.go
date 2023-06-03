package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	_ "github.com/lib/pq"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"

	"github.com/yuki0920/company-ranking/go/middleware"
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
	defer logger.Sync()

	// setup db
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

	databaseURL := os.Getenv("DATABASE_URL")
	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	logger.Info("Connected to database")

	// setup server
	// swagger, err := server.GetSwagger()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading swagger spec\n: %s", err)
		os.Exit(1)
	}

	r := chi.NewRouter()
	// r.Use(oapimiddleware.OapiRequestValidator(swagger))
	r.Use(middleware.Logger(logger))
	frontURL := os.Getenv("FRONT_URL")
	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{frontURL, "https://*", "company-ranking.net", "company-ranking.netlify.app"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods: []string{
			http.MethodGet,
			http.MethodHead,
			http.MethodPut,
			http.MethodPatch,
			http.MethodPost,
			http.MethodDelete,
			http.MethodOptions,
		},
		AllowedHeaders:     []string{"*"},
		AllowCredentials:   false, // Because cookie is not used
		OptionsPassthrough: false, // Always return status 200 for OPTIONS requests
		Debug:              true,
	}))

	svr := server.NewServer(db)
	server.HandlerFromMux(svr, r)

	// NOTE: API_HOST is for local development, don't change this.
	apiHost := os.Getenv("API_HOST")
	// NOTE: Heroku provides the port to bind to $PORT, don't change this.
	apiPort := os.Getenv("PORT")
	addr := fmt.Sprintf("%s:%s", apiHost, apiPort)
	s := &http.Server{
		Handler: r,
		Addr:    addr,
	}

	logger.Info("Server starting", zap.String("address", addr))
	log.Fatal(s.ListenAndServe())
}
