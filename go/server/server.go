package server

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

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
		message := fmt.Sprintf("security not found: %d", code)
		ErrorResponse(w, http.StatusInternalServerError, message)
	}

	docs, err := models.DocumentsBySecurityCode(ctx, s.DB, code)
	if err != nil {
		message := fmt.Sprintf("failed to fetch documents: %d", code)
		ErrorResponse(w, http.StatusInternalServerError, message)
	}
	var doc *models.Document
	if len(docs) != 0 {
		doc = docs[len(docs)-1]
	} else {
		message := fmt.Sprintf("document not found: %d", code)
		ErrorResponse(w, http.StatusInternalServerError, message)
		return
	}

	market, err := models.MarketByID(ctx, s.DB, sec.MarketID)
	if err != nil {
		message := fmt.Sprintf("failed to fetch market: %d", sec.MarketID)
		ErrorResponse(w, http.StatusInternalServerError, message)
		return
	}

	industry, err := models.IndustryByID(ctx, s.DB, int64(sec.IndustryCode))
	if err != nil {
		message := fmt.Sprintf("failed to fetch industry: %d", sec.IndustryCode)
		ErrorResponse(w, http.StatusInternalServerError, message)
		return
	}

	var periodEndedAt int
	if doc != nil {
		periodEndedAt, err = strconv.Atoi(doc.PeriodEndedAt.Month().String())
		if err != nil {
			message := fmt.Sprintf("failed to parse period_ended_at: %s", doc.PeriodEndedAt.String())
			ErrorResponse(w, http.StatusInternalServerError, message)
			return
		}
	}

	company := Company{
		AverageAgeYears:               &doc.AverageAgeYears.Float64,
		AverageAnnualSalary:           &doc.AverageAnnualSalary.Int64,
		AverageLengthOfServiceYears:   &doc.AverageLengthOfServiceYears.Float64,
		CapitalStock:                  &doc.CapitalStock.Int64,
		CashAndCashEquivalents:        &doc.CashAndCashEquivalents.Int64,
		CompanyName:                   doc.CompanyName.String,
		CompanyNameEn:                 doc.CompanyNameEn.String,
		ConsolidatedNumberOfEmployees: &doc.ConsolidatedNumberOfEmployees.Int64,
		EquityToAssetRatio:            &doc.EquityToAssetRatio.Float64,
		HeadOfficeLocation:            doc.HeadOfficeLocation.String,
		IndustryId:                    int32(industry.Code),
		IndustryName:                  industry.Name,
		LastYearNetSales:              &doc.LastYearNetSales.Int64,
		LastYearOperatingIncome:       &doc.LastYearOperatingIncome.Int64,
		LastYearOrdinaryIncome:        &doc.LastYearOrdinaryIncome.Int64,
		MarketId:                      market.ID,
		MarketName:                    market.Name,
		NetAssets:                     &doc.NetAssets.Int64,
		NetCashProvidedByUsedInFinancingActivities: &doc.NetCashProvidedByUsedInFinancingActivities.Int64,
		NetCashProvidedByUsedInInvestingActivities: &doc.NetCashProvidedByUsedInInvestingActivities.Int64,
		NetCashProvidedByUsedInOperatingActivities: &doc.NetCashProvidedByUsedInOperatingActivities.Int64,
		NetSales:             &doc.NetSales.Int64,
		NumberOfEmployees:    &doc.NumberOfEmployees.Int64,
		OperatingIncome:      &doc.OperatingIncome.Int64,
		OrdinaryIncome:       &doc.OrdinaryIncome.Int64,
		PeriodEndedAt:        doc.PeriodEndedAt.String(),
		PeriodEndedAtMonth:   periodEndedAt,
		PeriodEndedAtYear:    doc.PeriodEndedAt.Year(),
		PeriodStartedAt:      doc.PeriodStartedAt.Format("2006-01-02"),
		PriceEarningsRatio:   &doc.PriceEarningsRatio.Float64,
		RateOfReturnOnEquity: &doc.RateOfReturnOnEquity.Float64,
		Representative:       doc.Representative.String,
		SecurityCode:         sec.Code,
		SecurityId:           sec.ID,
		SecurityName:         sec.Name,
		TotalAssets:          &doc.TotalAssets.Int64,
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
	ctx := context.Background()
	ids, err := models.IndustryIDs(ctx, s.DB)
	if err != nil {
		message := fmt.Sprintf("failed to fetch industry ids")
		ErrorResponse(w, http.StatusInternalServerError, message)
		return
	}

	res := ResponseIndustryIDs{
		IndustryIds: ids,
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}

func (s *Server) FetchMarketIds(w http.ResponseWriter, r *http.Request) {
}

func (s *Server) FetchMarkets(w http.ResponseWriter, r *http.Request) {
}

func (s *Server) FetchMarket(w http.ResponseWriter, r *http.Request, id int) {
}

func ErrorResponse(w http.ResponseWriter, statusCode int, message string) {
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(Error{Message: message})

	return
}
