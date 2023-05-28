package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"

	omiddleware "github.com/deepmap/oapi-codegen/pkg/chi-middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	_ "github.com/lib/pq"
	"github.com/yuki0920/company-ranking/api-go/api"
	"github.com/yuki0920/company-ranking/api-go/models"
)

func main() {
	db, err := sql.Open("postgres", "postgresql://0.0.0.0:5432/myapp_development?user=postgres&password=password&sslmode=disable")
	defer db.Close()
	if err != nil {
		panic(err)
	}

	ctx := context.Background()
	ind, err := models.IndustryByID(ctx, db, 1)
	if err != nil {
		panic(err)
	}

	fmt.Println("ind", ind.Name)

	var port = flag.Int("port", 8080, "Port for test HTTP server")
	flag.Parse()

	swagger, err := api.GetSwagger()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading swagger spec\n: %s", err)
		os.Exit(1)
	}

	// Clear out the servers array in the swagger spec, that skips validating
	// that server names match. We don't know how this thing will be run.
	swagger.Servers = nil

	// Create an instance of our handler which satisfies the generated interface
	companyAPI := api.NewCompanyAPI(db)

	// This is how you set up a basic chi router
	r := chi.NewRouter()
	// Use our validation middleware to check all requests against the
	// OpenAPI schema.
	r.Use(omiddleware.OapiRequestValidator(swagger))

	r.Use(middleware.Logger)

	// We now register our petStore above as the handler for the interface
	api.HandlerFromMux(companyAPI, r)

	s := &http.Server{
		Handler: r,
		Addr:    fmt.Sprintf("localhost:%d", *port),
	}

	// And we serve HTTP until the world ends.
	log.Fatal(s.ListenAndServe())
}
