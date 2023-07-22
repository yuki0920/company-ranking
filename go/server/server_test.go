package server

import (
	"database/sql"
	"encoding/json"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/google/go-cmp/cmp"
	"github.com/yuki0920/company-ranking/go/logger"
)

var s *Server

func init() {
	env := os.Getenv("ENV")
	logger := logger.NewLogger(env)

	databaseURL := os.Getenv("DATABASE_TEST_URL")
	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		panic(err)
	}

	s = NewServer(db, logger)
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
