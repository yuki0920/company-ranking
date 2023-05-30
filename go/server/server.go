package server

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/yuki0920/company-ranking/go/models"
)

type Server struct {
	DB *sql.DB
}

type Error struct {
	Message string `json:"message"`
}

func NewServer(db *sql.DB) *Server {
	return &Server{
		DB: db,
	}
}

func (s *Server) FetchCompanies(w http.ResponseWriter, r *http.Request, params FetchCompaniesParams) {
}

func (s *Server) FetchCompany(w http.ResponseWriter, r *http.Request, code int) {
	ctx := context.Background()

	sec, err := models.SecurityByCode(ctx, s.DB, code)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		message := fmt.Sprintf("security not found: %d", code)
		json.NewEncoder(w).Encode(Error{Message: message})

		return
	}

	company := Company{
		AverageAgeYears:               nil,
		AverageAnnualSalary:           nil,
		AverageLengthOfServiceYears:   nil,
		CapitalStock:                  nil,
		CashAndCashEquivalents:        nil,
		CompanyName:                   "",
		CompanyNameEn:                 "",
		ConsolidatedNumberOfEmployees: nil,
		EquityToAssetRatio:            nil,
		HeadOfficeLocation:            "",
		IndustryId:                    0.0,
		IndustryName:                  "",
		LastYearNetSales:              nil,
		LastYearOperatingIncome:       nil,
		LastYearOrdinaryIncome:        nil,
		MarketId:                      0.0,
		MarketName:                    "",
		NetAssets:                     nil,
		NetCashProvidedByUsedInFinancingActivities: nil,
		NetCashProvidedByUsedInInvestingActivities: nil,
		NetCashProvidedByUsedInOperatingActivities: nil,
		NetSales:             nil,
		NumberOfEmployees:    nil,
		OperatingIncome:      nil,
		OrdinaryIncome:       nil,
		PeriodEndedAt:        "",
		PeriodEndedAtMonth:   0,
		PeriodEndedAtYear:    0,
		PeriodStartedAt:      "",
		PriceEarningsRatio:   nil,
		RateOfReturnOnEquity: nil,
		Representative:       "",
		SecurityCode:         sec.Code,
		SecurityId:           int(sec.ID),
		SecurityName:         sec.Name,
		TotalAssets:          nil,
	}

	res := ResponseCompany{
		Company: company,
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}

func (s *Server) FetchCompanyIds(w http.ResponseWriter, r *http.Request) {
}

func (s *Server) FetchIndustries(w http.ResponseWriter, r *http.Request) {
}

func (s *Server) FetchIndustry(w http.ResponseWriter, r *http.Request, id int) {
}

func (s *Server) FetchIndustryIds(w http.ResponseWriter, r *http.Request) {
}

func (s *Server) FetchMarketIds(w http.ResponseWriter, r *http.Request) {
}

func (s *Server) FetchMarkets(w http.ResponseWriter, r *http.Request) {
}

func (s *Server) FetchMarket(w http.ResponseWriter, r *http.Request, id int) {
}
