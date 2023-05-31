package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	oapimiddleware "github.com/deepmap/oapi-codegen/pkg/chi-middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	_ "github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/yuki0920/company-ranking/go/models"
	"github.com/yuki0920/company-ranking/go/server"
)

func main() {
	// setup logger
	logger, _ := zap.NewProduction()

	// setup db
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

	// setup server
	swagger, err := server.GetSwagger()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading swagger spec\n: %s", err)
		os.Exit(1)
	}

	r := chi.NewRouter()
	r.Use(oapimiddleware.OapiRequestValidator(swagger))
	r.Use(middleware.Logger)

	svr := server.NewServer(db)
	server.HandlerFromMux(svr, r)

	port := os.Getenv("SERVER_PORT")
	s := &http.Server{
		Handler: r,
		Addr:    fmt.Sprintf("localhost:%s", port),
	}

	log.Fatal(s.ListenAndServe())
}