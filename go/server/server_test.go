package server_test

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
	"github.com/yuki0920/company-ranking/go/server"
)

var (
	s   *server.Server
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

	s = server.NewServer(db, logger)
}

func setupSeed() {
	context := context.TODO()

	// security1
	security1 := models.SecurityFixture(func(security *models.Security) {
		security.Name = "会社1"
		security.Code = 1001
		security.MarketID = 1
		security.IndustryCode = 50
	})
	err := security1.Insert(context, db)
	if err != nil {
		panic(err)
	}

	document1 := models.DocumentFixture(func(document *models.Document) {
		document.SecurityCode = security1.Code
		document.CompanyNameEn = sql.NullString{String: "company1", Valid: true}
	})
	err = document1.Insert(context, db)
	if err != nil {
		panic(err)
	}

	// security2
	security2 := models.SecurityFixture(func(security *models.Security) {
		security.Name = "会社2"
		security.Code = 2002
		security.MarketID = 1
		security.IndustryCode = 50
	})
	err = security2.Insert(context, db)
	if err != nil {
		panic(err)
	}

	document2 := models.DocumentFixture(func(document *models.Document) {
		document.SecurityCode = security2.Code
		document.CompanyNameEn = sql.NullString{String: "company2", Valid: true}
	})
	err = document2.Insert(context, db)
	if err != nil {
		panic(err)
	}

	// security3
	security3 := models.SecurityFixture(func(security *models.Security) {
		security.Name = "会社3"
		security.Code = 3003
		security.MarketID = 2
		security.IndustryCode = 1050
	})
	err = security3.Insert(context, db)
	if err != nil {
		panic(err)
	}

	document3 := models.DocumentFixture(func(document *models.Document) {
		document.SecurityCode = security3.Code
		document.CompanyNameEn = sql.NullString{String: "company3", Valid: true}
	})
	err = document3.Insert(context, db)
	if err != nil {
		panic(err)
	}
}

func TestListCompanies(t *testing.T) {
	r := httptest.NewRequest("GET", "/api/v1/companies", nil)
	w := httptest.NewRecorder()
	params := server.ListCompaniesParams{
		SortType: "average_annual_salary",
	}
	s.ListCompanies(w, r, params)

	if w.Code != 200 {
		t.Errorf("expected 200 but got %d", w.Code)
	}

	want := server.ResponseCompanies{
		Companies: []server.EachCompany{
			{
				IndustryCode:   50,
				IndustryName:   "水産・農林業",
				MarketId:       1,
				MarketName:     "プライム",
				SecurityCode:   1001,
				SecurityName:   "会社1",
				SecurityNameEn: "company1",
			},
			{
				IndustryCode:   50,
				IndustryName:   "水産・農林業",
				MarketId:       1,
				MarketName:     "プライム",
				SecurityCode:   2002,
				SecurityName:   "会社2",
				SecurityNameEn: "company2",
			},
			{
				IndustryCode:   1050,
				IndustryName:   "鉱業",
				MarketId:       2,
				MarketName:     "スタンダード",
				SecurityCode:   3003,
				SecurityName:   "会社3",
				SecurityNameEn: "company3",
			},
		},
		Meta: server.Meta{
			CurrentPage: 1,
			LastPage:    1,
			LimitCount:  50,
			NextPage:    nil,
			PrevPage:    nil,
			OffsetCount: 1,
			SortType:    "average_annual_salary",
			TotalCount:  3,
		},
	}

	var got server.ResponseCompanies
	if err := json.Unmarshal(w.Body.Bytes(), &got); err != nil {
		t.Fatal(err)
	}

	if diff := cmp.Diff(want, got); diff != "" {
		t.Errorf("differs: (-want +got)\n%s", diff)
	}
}

func TestListCompaniesOfMarketId(t *testing.T) {
	r := httptest.NewRequest("GET", "/api/v1/companies", nil)
	w := httptest.NewRecorder()

	marketId := new(int)
	*marketId = 1
	params := server.ListCompaniesParams{
		MarketId: marketId,
		SortType: "average_annual_salary",
	}
	s.ListCompanies(w, r, params)

	if w.Code != 200 {
		t.Errorf("expected 200 but got %d", w.Code)
	}

	want := server.ResponseCompanies{
		Companies: []server.EachCompany{
			{
				IndustryCode:   50,
				IndustryName:   "水産・農林業",
				MarketId:       1,
				MarketName:     "プライム",
				SecurityCode:   1001,
				SecurityName:   "会社1",
				SecurityNameEn: "company1",
			},
			{
				IndustryCode:   50,
				IndustryName:   "水産・農林業",
				MarketId:       1,
				MarketName:     "プライム",
				SecurityCode:   2002,
				SecurityName:   "会社2",
				SecurityNameEn: "company2",
			},
		},
		Meta: server.Meta{
			CurrentPage: 1,
			LastPage:    1,
			LimitCount:  50,
			NextPage:    nil,
			PrevPage:    nil,
			OffsetCount: 1,
			SortType:    "average_annual_salary",
			TotalCount:  2,
		},
	}

	var got server.ResponseCompanies
	if err := json.Unmarshal(w.Body.Bytes(), &got); err != nil {
		t.Fatal(err)
	}

	if diff := cmp.Diff(want, got); diff != "" {
		t.Errorf("differs: (-want +got)\n%s", diff)
	}
}

func TestGetCompany(t *testing.T) {
	r := httptest.NewRequest("GET", "/api/v1/companies", nil)
	w := httptest.NewRecorder()
	s.GetCompany(w, r, 1001)

	if w.Code != 200 {
		t.Errorf("expected 200 but got %d", w.Code)
	}
}

func TestListSecurityCodes(t *testing.T) {
	r := httptest.NewRequest("GET", "/api/v1/company_ids", nil)
	w := httptest.NewRecorder()
	s.ListSecurityCodes(w, r)

	if w.Code != 200 {
		t.Errorf("expected 200 but got %d", w.Code)
	}

	var got server.ResponseSecurityCodes
	if err := json.Unmarshal(w.Body.Bytes(), &got); err != nil {
		t.Fatal(err)
	}

	securityLen := len(got.SecurityCodes)
	if securityLen != 3 {
		t.Errorf("expected 3 but got %d", securityLen)
	}
}

func TestListMarketIds(t *testing.T) {
	r := httptest.NewRequest("GET", "/api/v1/market_ids", nil)
	w := httptest.NewRecorder()
	s.ListMarketIds(w, r)

	if w.Code != 200 {
		t.Errorf("expected 200 but got %d", w.Code)
	}

	want := server.ResponseMarketIDs{
		MarketIds: []int64{1, 2, 3},
	}

	var got server.ResponseMarketIDs
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

	want := server.ResponseMarkets{
		Markets: []server.EachMarket{
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

	var got server.ResponseMarkets
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

	want := server.ResponseMarket{
		Market: server.Market{
			Id:   1,
			Name: "プライム",
		},
	}

	var got server.ResponseMarket
	if err := json.Unmarshal(w.Body.Bytes(), &got); err != nil {
		t.Fatal(err)
	}

	if diff := cmp.Diff(want, got); diff != "" {
		t.Errorf("differs: (-want +got)\n%s", diff)
	}
}

func TestListIndustryIds(t *testing.T) {
	r := httptest.NewRequest("GET", "/api/v1/industryids", nil)
	w := httptest.NewRecorder()
	s.ListIndustryIds(w, r)

	if w.Code != 200 {
		t.Errorf("expected 200 but got %d", w.Code)
	}

	var got server.ResponseIndustryIDs
	if err := json.Unmarshal(w.Body.Bytes(), &got); err != nil {
		t.Fatal(err)
	}

	industryLen := len(got.IndustryIds)
	if industryLen != 33 {
		t.Errorf("expected 33 but got %d", industryLen)
	}
}

func TestListIndustries(t *testing.T) {
	r := httptest.NewRequest("GET", "/api/v1/industries", nil)
	w := httptest.NewRecorder()
	s.ListIndustries(w, r)

	if w.Code != 200 {
		t.Errorf("expected 200 but got %d", w.Code)
	}

	want := server.EachIndustry{
		Count: 2,
		Id:    1,
		Name:  "水産・農林業",
		Code:  50,
	}

	var got server.ResponseIndustries
	if err := json.Unmarshal(w.Body.Bytes(), &got); err != nil {
		t.Fatal(err)
	}

	var isIncluded bool
	for _, industry := range got.Industries {
		diff := cmp.Diff(want, industry)
		if diff == "" {
			isIncluded = true
		}
	}

	if !isIncluded {
		t.Errorf("expected %+v is included but not", want)
	}
}

func TestListIndustry(t *testing.T) {
	r := httptest.NewRequest("GET", "/api/v1/industries", nil)
	w := httptest.NewRecorder()
	s.GetIndustry(w, r, 1)

	if w.Code != 200 {
		t.Errorf("expected 200 but got %d", w.Code)
	}

	want := server.ResponseIndustry{
		Industry: server.Industry{
			Id:   1,
			Name: "水産・農林業",
			Code: 50,
		},
	}

	var got server.ResponseIndustry
	if err := json.Unmarshal(w.Body.Bytes(), &got); err != nil {
		t.Fatal(err)
	}

	if diff := cmp.Diff(want, got); diff != "" {
		t.Errorf("differs: (-want +got)\n%s", diff)
	}
}
