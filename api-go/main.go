package main

import (
	"context"
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
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
}
