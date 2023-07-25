package server

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/google/go-cmp/cmp"
	"github.com/yuki0920/company-ranking/go/logger"
	"github.com/yuki0920/company-ranking/go/models"
)

var (
	s   *Server
	db  *sql.DB
	err error
)

func init() {
	env := os.Getenv("ENV")
	logger := logger.NewLogger(env)

	databaseURL := os.Getenv("DATABASE_TEST_URL")
	db, err = sql.Open("postgres", databaseURL)
	if err != nil {
		panic(err)
	}

	setupSeed()

	s = NewServer(db, logger)
}

func setupSeed() {
	context := context.TODO()

	// security1
	security1 := models.SecurityFixture(func(security *models.Security) {
		security.MarketID = 1
		security.IndustryCode = 50
	})
	err := security1.Insert(context, db)
	if err != nil {
		panic(err)
	}

	document1 := models.DocumentFixture(func(document *models.Document) {
		document.SecurityCode = security1.Code
	})
	err = document1.Insert(context, db)
	if err != nil {
		panic(err)
	}

	// security2
	security2 := models.SecurityFixture(func(security *models.Security) {
		security.MarketID = 1
		security.IndustryCode = 50
	})
	err = security2.Insert(context, db)
	if err != nil {
		panic(err)
	}

	document2 := models.DocumentFixture(func(document *models.Document) {
		document.SecurityCode = security2.Code
	})
	err = document2.Insert(context, db)
	if err != nil {
		panic(err)
	}

	// security3
	security3 := models.SecurityFixture(func(security *models.Security) {
		security.MarketID = 2
		security.IndustryCode = 50
	})
	err = security3.Insert(context, db)
	if err != nil {
		panic(err)
	}

	document3 := models.DocumentFixture(func(document *models.Document) {
		document.SecurityCode = security3.Code
	})
	err = document3.Insert(context, db)
	if err != nil {
		panic(err)
	}
}

func TestListMarketIds(t *testing.T) {
	r := httptest.NewRequest("GET", "/api/v1/market_ids", nil)
	w := httptest.NewRecorder()
	s.ListMarketIds(w, r)

	if w.Code != 200 {
		t.Errorf("expected 200 but got %d", w.Code)
	}

	want := ResponseMarketIDs{
		MarketIds: []int64{1, 2, 3},
	}

	var got ResponseMarketIDs
	if err := json.Unmarshal(w.Body.Bytes(), &got); err != nil {
		t.Fatal(err)
	}

	if diff := cmp.Diff(want, got); diff != "" {
		t.Errorf("differs: (-want +got)\n%s", diff)
	}
}

func TestListMarkets(t *testing.T) {
	r := httptest.NewRequest("GET", "/api/v1/markets", nil)
	w := httptest.NewRecorder()
	s.ListMarkets(w, r)

	if w.Code != 200 {
		t.Errorf("expected 200 but got %d", w.Code)
	}

	want := ResponseMarkets{
		Markets: []EachMarket{
			{
				Count: 2,
				Id:    1,
				Name:  "プライム",
			},
			{
				Count: 1,
				Id:    2,
				Name:  "スタンダード",
			},
			{
				Count: 0,
				Id:    3,
				Name:  "グロース",
			},
		},
	}

	var got ResponseMarkets
	if err := json.Unmarshal(w.Body.Bytes(), &got); err != nil {
		t.Fatal(err)
	}

	if diff := cmp.Diff(want, got); diff != "" {
		t.Errorf("differs: (-want +got)\n%s", diff)
	}
}

func TestGetMarket(t *testing.T) {
	r := httptest.NewRequest("GET", "/api/v1/market", nil)
	w := httptest.NewRecorder()
	s.GetMarket(w, r, 1)

	if w.Code != 200 {
		t.Errorf("expected 200 but got %d", w.Code)
	}

	want := ResponseMarket{
		Market: Market{
			Id:   1,
			Name: "プライム",
		},
	}

	var got ResponseMarket
	if err := json.Unmarshal(w.Body.Bytes(), &got); err != nil {
		t.Fatal(err)
	}

	if diff := cmp.Diff(want, got); diff != "" {
		t.Errorf("differs: (-want +got)\n%s", diff)
	}
}
