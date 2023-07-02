package server

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	_ "github.com/lib/pq"

	"github.com/yuki0920/company-ranking/go/middleware"
	"github.com/yuki0920/company-ranking/go/models"
	"go.uber.org/zap"
)

type Server struct {
	Router *chi.Mux
	DB     *sql.DB
	Logger *zap.Logger
}

type Error struct {
	Message string `json:"message"`
}

func NewServer(db *sql.DB, logger *zap.Logger) *Server {
	router := chi.NewRouter()
	return &Server{
		Router: router,
		DB:     db,
		Logger: logger,
	}
}

func (s *Server) MountHandlers(frontURL string) {
	s.Router.Use(middleware.Logger(s.Logger))
	s.Router.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts

		// TODO: remove http://* and https://* in production
		AllowedOrigins: []string{frontURL, "http://*", "https://*", "company-ranking.net", "company-ranking.netlify.app"},
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

	HandlerFromMux(s, s.Router)
}

func (s *Server) StartServer(addr string) error {
	hs := &http.Server{
		Handler: s.Router,
		Addr:    addr,
	}

	s.Logger.Info("Server starting", zap.String("address", addr))

	return hs.ListenAndServe()
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

func (s *Server) ListCompanyIds(w http.ResponseWriter, r *http.Request) {
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
	categories, err := models.IndustryCategoryALL(ctx, s.DB)
	if err != nil {
		message := "failed to fetch category counts"
		ErrorResponse(w, http.StatusInternalServerError, message)
		return
	}

	var eachCategories []EachIndustryCategory
	for _, category := range categories {
		var eachCategory EachIndustryCategory
		eachCategory.Id = category.ID
		eachCategory.Name = category.Name
		var inds []EachIndustryCategoryIndustry
		for _, industry := range industries {
			if industry.IndustryCategoryID.Int64 == category.ID {
				ind := EachIndustryCategoryIndustry{
					Id:    industry.ID,
					Name:  industry.Name,
					Code:  int32(industry.Code),
					Count: int32(counts[industry.Code]),
				}
				inds = append(inds, ind)
			}
		}
		eachCategory.Industries = &inds
		eachCategories = append(eachCategories, eachCategory)
	}

	res := ResponseIndustries{
		IndustryCategories: eachCategories,
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
