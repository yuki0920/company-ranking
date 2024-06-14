package server

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"regexp"
	"strconv"

	_ "github.com/lib/pq"
	"github.com/rs/cors"

	"github.com/yuki0920/company-ranking/go/models"
)

type Server struct {
	Router *http.ServeMux
	DB     *sql.DB
}

type Error struct {
	Message string `json:"message"`
}

func NewServer(db *sql.DB) *Server {
	mux := http.NewServeMux()
	return &Server{
		Router: mux,
		DB:     db,
	}
}

func StartServer(addr string, handler http.Handler) error {
	hs := &http.Server{
		Handler: handler,
		Addr:    addr,
	}

	slog.Info("Server starting", slog.String("address", addr))

	return hs.ListenAndServe()
}

func (s *Server) CreateHandler(frontURL string) http.Handler {
	handler := HandlerFromMux(s, s.Router)

	c := cors.New(cors.Options{
		AllowedOrigins: []string{frontURL, "http://*", "https://*", "company-ranking.net", "company-ranking.netlify.app"},
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
	})

	return c.Handler(handler)
}

// perPage is the number of securities to return per page.
const perPage = 50

func (s *Server) ListCompanies(w http.ResponseWriter, r *http.Request, params ListCompaniesParams) {
	ctx := context.Background()

	// calculate metadata
	currentPage := 1
	limitCount := perPage
	var offsetCount int
	if params.Page != nil {
		currentPage = *params.Page
	}
	offsetCount = (currentPage - 1) * perPage

	// parse params
	var sortType string
	switch params.SortType {
	case "net_sales", "average_annual_salary", "ordinary_income":
		sortType = string(params.SortType)
	default:
		message := fmt.Sprintf("invalid sort_type: %s", params.SortType)
		ErrorResponse(w, http.StatusBadRequest, message)
		return
	}

	var code *int
	var query *string
	if params.Q != nil {
		isNum, _ := regexp.MatchString(`^[0-9]+$`, *params.Q)
		if isNum {
			cod, _ := strconv.Atoi(*params.Q)
			code = &cod
		} else {
			query = params.Q
		}
	}

	// fetch securities totalCount
	totalCount, err := models.SecurityListCount(ctx, s.DB, params.IndustryId, params.MarketId, code, query)
	if err != nil {
		message := "failed to fetch securities count"
		ErrorResponse(w, http.StatusInternalServerError, message)
		return
	}
	meta := metaData(currentPage, offsetCount, limitCount, totalCount, sortType)

	// fetch securities
	securities, err := models.SecurityListPagination(ctx, s.DB, limitCount, offsetCount, sortType, params.IndustryId, params.MarketId, code, query)
	if err != nil {
		message := "failed to fetch securities"
		ErrorResponse(w, http.StatusInternalServerError, message)
		return
	}

	var eachCompanies []EachCompany
	for _, security := range securities {
		company := EachCompany{
			SecurityName:        security.Name,
			SecurityNameEn:      security.NameEn,
			SecurityCode:        security.Code,
			IndustryCode:        int32(security.IndustryCode),
			IndustryName:        security.IndustryName,
			MarketId:            int32(security.MarketID),
			MarketName:          security.MarketName,
			AverageAnnualSalary: security.AverageAnnualSalary,
			NetSales:            security.NetSales,
			OrdinaryIncome:      security.OrdinaryIncome,
		}
		eachCompanies = append(eachCompanies, company)
	}

	res := ResponseCompanies{
		Companies: eachCompanies,
		Meta:      meta,
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(res)
}

func metaData(currentPage, offsetCount, limitCount, totalCount int, sortType string) Meta {
	var lastPage int
	var prevPage, nextPage *int

	if totalCount != 0 {
		lastPage = totalCount/perPage + 1
	} else {
		lastPage = 0
	}
	if currentPage != 1 {
		prev := (currentPage - 1)
		prevPage = &prev
	}
	if currentPage < lastPage {
		next := (currentPage + 1)
		nextPage = &next
	}

	return Meta{
		TotalCount:  totalCount,
		OffsetCount: offsetCount + 1,
		LimitCount:  perPage,
		NextPage:    nextPage,
		CurrentPage: currentPage,
		LastPage:    lastPage,
		PrevPage:    prevPage,
		SortType:    sortType,
	}
}

func (s *Server) GetCompany(w http.ResponseWriter, r *http.Request, code int) {
	ctx := context.Background()

	sec, err := models.SecurityByCode(ctx, s.DB, code)
	if err != nil {
		message := fmt.Sprintf("security not found: %d", code)
		ErrorResponse(w, http.StatusInternalServerError, message)
		return
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

	industry, err := models.IndustryByCode(ctx, s.DB, sec.IndustryCode)
	if err != nil {
		message := fmt.Sprintf("failed to fetch industry: %d", sec.IndustryCode)
		ErrorResponse(w, http.StatusInternalServerError, message)
		return
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
		IndustryCode:                  int32(industry.Code),
		IndustryId:                    int32(industry.ID),
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
		NetSales:                  &doc.NetSales.Int64,
		NumberOfEmployees:         &doc.NumberOfEmployees.Int64,
		OperatingIncome:           &doc.OperatingIncome.Int64,
		OrdinaryIncome:            &doc.OrdinaryIncome.Int64,
		PayoutRatio:               &doc.PayoutRatio.Float64,
		PeriodEndedAt:             doc.PeriodEndedAt.Format("2006-01-02"),
		PeriodEndedAtMonth:        int(doc.PeriodEndedAt.Month()),
		PeriodEndedAtYear:         doc.PeriodEndedAt.Year(),
		PeriodStartedAt:           doc.PeriodStartedAt.Format("2006-01-02"),
		PriceEarningsRatio:        &doc.PriceEarningsRatio.Float64,
		RateOfReturnOnEquity:      &doc.RateOfReturnOnEquity.Float64,
		Representative:            doc.Representative.String,
		SecurityCode:              sec.Code,
		SecurityId:                sec.ID,
		SecurityName:              sec.Name,
		TotalAssets:               &doc.TotalAssets.Int64,
		TotalNumberOfIssuedShares: &doc.TotalNumberOfIssuedShares.Int64,
	}

	res := ResponseCompany{
		Company: company,
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(res)
}

func (s *Server) ListSecurityCodes(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	codes, err := models.SecurityCodes(ctx, s.DB)
	if err != nil {
		message := "failed to fetch security codes"
		ErrorResponse(w, http.StatusInternalServerError, message)
		return
	}

	res := ResponseSecurityCodes{
		SecurityCodes: codes,
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(res)
}

func (s *Server) ListIndustries(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	industries, err := models.IndustryALL(ctx, s.DB)
	if err != nil {
		message := "failed to fetch industries"
		ErrorResponse(w, http.StatusInternalServerError, message)
		return
	}
	counts, err := models.SecurityCountByIndustry(ctx, s.DB)
	if err != nil {
		message := "failed to fetch security counts"
		ErrorResponse(w, http.StatusInternalServerError, message)
		return
	}

	var eachIndustries []EachIndustry
	for _, industry := range industries {
		var eachIndustry EachIndustry
		eachIndustry.Id = industry.ID
		eachIndustry.Name = industry.Name
		eachIndustry.Code = int32(industry.Code)
		eachIndustry.Count = int32(counts[industry.Code])
		eachIndustries = append(eachIndustries, eachIndustry)
	}

	res := ResponseIndustries{
		Industries: eachIndustries,
	}
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(res)
}

func (s *Server) GetIndustry(w http.ResponseWriter, r *http.Request, id int) {
	ctx := context.Background()
	industry, err := models.IndustryByID(ctx, s.DB, int64(id))
	if err != nil {
		message := fmt.Sprintf("failed to fetch industry: %d", id)
		ErrorResponse(w, http.StatusInternalServerError, message)
		return
	}

	res := ResponseIndustry{
		Industry: Industry{
			Id:   industry.ID,
			Name: industry.Name,
			Code: industry.Code,
		},
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(res)
}

func (s *Server) ListIndustryIds(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	ids, err := models.IndustryIDs(ctx, s.DB)
	if err != nil {
		message := "failed to fetch industry ids"
		ErrorResponse(w, http.StatusInternalServerError, message)
		return
	}

	res := ResponseIndustryIDs{
		IndustryIds: ids,
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(res)
}

func (s *Server) ListMarketIds(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	ids, err := models.MarketIDs(ctx, s.DB)
	if err != nil {
		message := "failed to fetch market ids"
		ErrorResponse(w, http.StatusInternalServerError, message)
		return
	}

	res := ResponseMarketIDs{
		MarketIds: ids,
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(res)
}

func (s *Server) ListMarkets(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	markets, err := models.MarketALL(ctx, s.DB)
	if err != nil {
		message := "failed to fetch markets"
		ErrorResponse(w, http.StatusInternalServerError, message)
		return
	}
	counts, err := models.SecurityCountByMarket(ctx, s.DB)
	if err != nil {
		message := "failed to fetch security counts"
		ErrorResponse(w, http.StatusInternalServerError, message)
		return
	}

	var eachMarkets []EachMarket
	for _, market := range markets {
		var eachMarket EachMarket
		eachMarket.Id = market.ID
		eachMarket.Name = market.Name
		eachMarket.Count = counts[int(market.ID)]
		eachMarkets = append(eachMarkets, eachMarket)
	}

	res := ResponseMarkets{
		Markets: eachMarkets,
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(res)
}

func (s *Server) GetMarket(w http.ResponseWriter, r *http.Request, id int) {
	ctx := context.Background()
	market, err := models.MarketByID(ctx, s.DB, int64(id))
	if err != nil {
		message := fmt.Sprintf("failed to fetch market: %d", id)
		ErrorResponse(w, http.StatusInternalServerError, message)
		return
	}

	res := ResponseMarket{
		Market: Market{
			Id:   market.ID,
			Name: market.Name,
		},
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(res)
}

func ErrorResponse(w http.ResponseWriter, statusCode int, message string) {
	w.WriteHeader(statusCode)
	_ = json.NewEncoder(w).Encode(Error{Message: message})
}
