// Package server provides primitives to interact with the openapi HTTP API.
//
// Code generated by github.com/deepmap/oapi-codegen version v1.12.4 DO NOT EDIT.
package server

import (
	"bytes"
	"compress/gzip"
	"encoding/base64"
	"fmt"
	"net/http"
	"net/url"
	"path"
	"strings"

	"github.com/deepmap/oapi-codegen/pkg/runtime"
	"github.com/getkin/kin-openapi/openapi3"
	"github.com/go-chi/chi/v5"
)

// Defines values for FetchCompaniesParamsSortType.
const (
	AverageAnnualSalary FetchCompaniesParamsSortType = "average_annual_salary"
	NetSales            FetchCompaniesParamsSortType = "net_sales"
	OrdinaryIncome      FetchCompaniesParamsSortType = "ordinary_income"
)

// Company defines model for Company.
type Company struct {
	AverageAgeYears *float64 `json:"average_age_years"`

	// AverageAnnualSalary 1万で割った値
	AverageAnnualSalary         *int64   `json:"average_annual_salary"`
	AverageLengthOfServiceYears *float64 `json:"average_length_of_service_years"`
	CapitalStock                *int64   `json:"capital_stock"`

	// CashAndCashEquivalents 現金及び現金同等物
	CashAndCashEquivalents *int64 `json:"cash_and_cash_equivalents"`
	CompanyName            string `json:"company_name"`
	CompanyNameEn          string `json:"company_name_en"`

	// ConsolidatedNumberOfEmployees 連結従業員数
	ConsolidatedNumberOfEmployees *int64 `json:"consolidated_number_of_employees"`

	// EquityToAssetRatio 自己資本比率
	EquityToAssetRatio *float64 `json:"equity_to_asset_ratio"`
	HeadOfficeLocation string   `json:"head_office_location"`
	IndustryId         int32    `json:"industry_id"`
	IndustryName       string   `json:"industry_name"`

	// LastYearNetSales 1億で割った値
	LastYearNetSales *int64 `json:"last_year_net_sales"`

	// LastYearOperatingIncome 1億で割った値
	LastYearOperatingIncome *int64 `json:"last_year_operating_income"`

	// LastYearOrdinaryIncome 1億で割った値
	LastYearOrdinaryIncome *int64 `json:"last_year_ordinary_income"`
	MarketId               int64  `json:"market_id"`
	MarketName             string `json:"market_name"`

	// NetAssets 純資産
	NetAssets *int64 `json:"net_assets"`

	// NetCashProvidedByUsedInFinancingActivities 財務キャッシュフロー
	NetCashProvidedByUsedInFinancingActivities *int64 `json:"net_cash_provided_by_used_in_financing_activities"`

	// NetCashProvidedByUsedInInvestingActivities 投資キャッシュフロー
	NetCashProvidedByUsedInInvestingActivities *int64 `json:"net_cash_provided_by_used_in_investing_activities"`

	// NetCashProvidedByUsedInOperatingActivities 営業キャッシュフロー
	NetCashProvidedByUsedInOperatingActivities *int64 `json:"net_cash_provided_by_used_in_operating_activities"`

	// NetSales 1億で割った値
	NetSales          *int64 `json:"net_sales"`
	NumberOfEmployees *int64 `json:"number_of_employees"`

	// OperatingIncome 1億で割った値
	OperatingIncome *int64 `json:"operating_income"`

	// OrdinaryIncome 1億で割った値
	OrdinaryIncome     *int64 `json:"ordinary_income"`
	PeriodEndedAt      string `json:"period_ended_at"`
	PeriodEndedAtMonth int    `json:"period_ended_at_month"`
	PeriodEndedAtYear  int    `json:"period_ended_at_year"`
	PeriodStartedAt    string `json:"period_started_at"`

	// PriceEarningsRatio 株価収益率(PER)
	PriceEarningsRatio *float64 `json:"price_earnings_ratio"`

	// RateOfReturnOnEquity 自己資本利益率(ROE)
	RateOfReturnOnEquity *float64 `json:"rate_of_return_on_equity"`
	Representative       string   `json:"representative"`
	SecurityCode         int      `json:"security_code"`
	SecurityId           int64    `json:"security_id"`
	SecurityName         string   `json:"security_name"`
	SubmittedAt          string   `json:"submitted_at"`

	// TotalAssets 総資産
	TotalAssets *int64 `json:"total_assets"`
}

// EachCompany defines model for eachCompany.
type EachCompany struct {
	// AverageAnnualSalary 1万で割った値
	AverageAnnualSalary *int64 `json:"average_annual_salary"`
	IndustryName        string `json:"industry_name"`
	MarketName          string `json:"market_name"`

	// NetSales 1億で割った値
	NetSales *int64 `json:"net_sales"`

	// OrdinaryIncome 1億で割った値
	OrdinaryIncome *int64 `json:"ordinary_income"`
	SecurityCode   int    `json:"security_code"`
	SecurityName   string `json:"security_name"`
}

// EachIndustryCategory defines model for eachIndustryCategory.
type EachIndustryCategory struct {
	Id         int64 `json:"id"`
	Industries *[]struct {
		// Code 33業種コード
		Code int `json:"code"`

		// Count 業種に属する企業数
		Count int    `json:"count"`
		Id    int64  `json:"id"`
		Name  string `json:"name"`
	} `json:"industries"`
	Name string `json:"name"`
}

// EachMarket defines model for eachMarket.
type EachMarket struct {
	// Count 市場に属する企業数
	Count int    `json:"count"`
	Id    int64  `json:"id"`
	Name  string `json:"name"`
}

// Industry defines model for industry.
type Industry struct {
	Code int    `json:"code"`
	Id   int    `json:"id"`
	Name string `json:"name"`
}

// Market defines model for market.
type Market struct {
	Id   int64  `json:"id"`
	Name string `json:"name"`
}

// Meta defines model for meta.
type Meta struct {
	// Count 総アイテム数
	Count int `json:"count"`

	// From アイテムの取得開始位置
	From int `json:"from"`

	// Items 1ページあたりのアイテム数
	Items int `json:"items"`

	// Next 次のページ番号
	Next *int `json:"next"`

	// Page 現在のページ番号
	Page int `json:"page"`

	// Pages 最後ののページ番号
	Pages int `json:"pages"`

	// Prev 前のページ番号
	Prev *int `json:"prev"`
}

// ResponseCompanies defines model for responseCompanies.
type ResponseCompanies struct {
	Companies []EachCompany `json:"companies"`
	Meta      Meta          `json:"meta"`
}

// ResponseCompany defines model for responseCompany.
type ResponseCompany struct {
	Company Company `json:"company"`
}

// ResponseIndustries defines model for responseIndustries.
type ResponseIndustries struct {
	IndustryCategories []EachIndustryCategory `json:"industry_categories"`
}

// ResponseIndustry defines model for responseIndustry.
type ResponseIndustry struct {
	Industry Industry `json:"industry"`
}

// ResponseIndustryIDs defines model for responseIndustryIDs.
type ResponseIndustryIDs struct {
	IndustryIds []int64 `json:"industry_ids"`
}

// ResponseMarket defines model for responseMarket.
type ResponseMarket struct {
	Market Market `json:"market"`
}

// ResponseMarketIDs defines model for responseMarketIDs.
type ResponseMarketIDs struct {
	MarketIds []int64 `json:"market_ids"`
}

// ResponseMarkets defines model for responseMarkets.
type ResponseMarkets struct {
	Markets []EachMarket `json:"markets"`
}

// FetchCompaniesParams defines parameters for FetchCompanies.
type FetchCompaniesParams struct {
	Page     *int                         `form:"page,omitempty" json:"page,omitempty"`
	SortType FetchCompaniesParamsSortType `form:"sort_type" json:"sort_type"`

	// Q query for company_name or security_id
	Q          *string `form:"q,omitempty" json:"q,omitempty"`
	IndustryId *int    `form:"industry_id,omitempty" json:"industry_id,omitempty"`
	MarketId   *int    `form:"market_id,omitempty" json:"market_id,omitempty"`
}

// FetchCompaniesParamsSortType defines parameters for FetchCompanies.
type FetchCompaniesParamsSortType string

// ServerInterface represents all server handlers.
type ServerInterface interface {
	// Get and Search Companies
	// (GET /api/v1/companies)
	FetchCompanies(w http.ResponseWriter, r *http.Request, params FetchCompaniesParams)
	// Get Company
	// (GET /api/v1/companies/{code})
	FetchCompany(w http.ResponseWriter, r *http.Request, code int)
	// Get CompanyIds
	// (GET /api/v1/company_ids)
	FetchCompanyIds(w http.ResponseWriter, r *http.Request)
	// Get Industries
	// (GET /api/v1/industries)
	FetchIndustries(w http.ResponseWriter, r *http.Request)
	// Get Industry
	// (GET /api/v1/industries/{id})
	FetchIndustry(w http.ResponseWriter, r *http.Request, id int)
	// Get IndustryIds
	// (GET /api/v1/industry_ids)
	FetchIndustryIds(w http.ResponseWriter, r *http.Request)
	// Get MarketIds
	// (GET /api/v1/market_ids)
	FetchMarketIds(w http.ResponseWriter, r *http.Request)
	// Get Markets
	// (GET /api/v1/markets)
	FetchMarkets(w http.ResponseWriter, r *http.Request)
	// Get Market
	// (GET /api/v1/markets/{id})
	FetchMarket(w http.ResponseWriter, r *http.Request, id int)
}

// ServerInterfaceWrapper converts contexts to parameters.
type ServerInterfaceWrapper struct {
	Handler            ServerInterface
	HandlerMiddlewares []MiddlewareFunc
	ErrorHandlerFunc   func(w http.ResponseWriter, r *http.Request, err error)
}

type MiddlewareFunc func(http.Handler) http.Handler

// FetchCompanies operation middleware
func (siw *ServerInterfaceWrapper) FetchCompanies(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var err error

	// Parameter object where we will unmarshal all parameters from the context
	var params FetchCompaniesParams

	// ------------- Optional query parameter "page" -------------

	err = runtime.BindQueryParameter("form", true, false, "page", r.URL.Query(), &params.Page)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "page", Err: err})
		return
	}

	// ------------- Required query parameter "sort_type" -------------

	if paramValue := r.URL.Query().Get("sort_type"); paramValue != "" {

	} else {
		siw.ErrorHandlerFunc(w, r, &RequiredParamError{ParamName: "sort_type"})
		return
	}

	err = runtime.BindQueryParameter("form", true, true, "sort_type", r.URL.Query(), &params.SortType)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "sort_type", Err: err})
		return
	}

	// ------------- Optional query parameter "q" -------------

	err = runtime.BindQueryParameter("form", true, false, "q", r.URL.Query(), &params.Q)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "q", Err: err})
		return
	}

	// ------------- Optional query parameter "industry_id" -------------

	err = runtime.BindQueryParameter("form", true, false, "industry_id", r.URL.Query(), &params.IndustryId)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "industry_id", Err: err})
		return
	}

	// ------------- Optional query parameter "market_id" -------------

	err = runtime.BindQueryParameter("form", true, false, "market_id", r.URL.Query(), &params.MarketId)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "market_id", Err: err})
		return
	}

	var handler http.Handler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.FetchCompanies(w, r, params)
	})

	for i := len(siw.HandlerMiddlewares) - 1; i >= 0; i-- {
		handler = siw.HandlerMiddlewares[i](handler)
	}

	handler.ServeHTTP(w, r.WithContext(ctx))
}

// FetchCompany operation middleware
func (siw *ServerInterfaceWrapper) FetchCompany(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var err error

	// ------------- Path parameter "code" -------------
	var code int

	err = runtime.BindStyledParameterWithLocation("simple", false, "code", runtime.ParamLocationPath, chi.URLParam(r, "code"), &code)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "code", Err: err})
		return
	}

	var handler http.Handler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.FetchCompany(w, r, code)
	})

	for i := len(siw.HandlerMiddlewares) - 1; i >= 0; i-- {
		handler = siw.HandlerMiddlewares[i](handler)
	}

	handler.ServeHTTP(w, r.WithContext(ctx))
}

// FetchCompanyIds operation middleware
func (siw *ServerInterfaceWrapper) FetchCompanyIds(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var handler http.Handler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.FetchCompanyIds(w, r)
	})

	for i := len(siw.HandlerMiddlewares) - 1; i >= 0; i-- {
		handler = siw.HandlerMiddlewares[i](handler)
	}

	handler.ServeHTTP(w, r.WithContext(ctx))
}

// FetchIndustries operation middleware
func (siw *ServerInterfaceWrapper) FetchIndustries(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var handler http.Handler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.FetchIndustries(w, r)
	})

	for i := len(siw.HandlerMiddlewares) - 1; i >= 0; i-- {
		handler = siw.HandlerMiddlewares[i](handler)
	}

	handler.ServeHTTP(w, r.WithContext(ctx))
}

// FetchIndustry operation middleware
func (siw *ServerInterfaceWrapper) FetchIndustry(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var err error

	// ------------- Path parameter "id" -------------
	var id int

	err = runtime.BindStyledParameterWithLocation("simple", false, "id", runtime.ParamLocationPath, chi.URLParam(r, "id"), &id)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "id", Err: err})
		return
	}

	var handler http.Handler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.FetchIndustry(w, r, id)
	})

	for i := len(siw.HandlerMiddlewares) - 1; i >= 0; i-- {
		handler = siw.HandlerMiddlewares[i](handler)
	}

	handler.ServeHTTP(w, r.WithContext(ctx))
}

// FetchIndustryIds operation middleware
func (siw *ServerInterfaceWrapper) FetchIndustryIds(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var handler http.Handler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.FetchIndustryIds(w, r)
	})

	for i := len(siw.HandlerMiddlewares) - 1; i >= 0; i-- {
		handler = siw.HandlerMiddlewares[i](handler)
	}

	handler.ServeHTTP(w, r.WithContext(ctx))
}

// FetchMarketIds operation middleware
func (siw *ServerInterfaceWrapper) FetchMarketIds(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var handler http.Handler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.FetchMarketIds(w, r)
	})

	for i := len(siw.HandlerMiddlewares) - 1; i >= 0; i-- {
		handler = siw.HandlerMiddlewares[i](handler)
	}

	handler.ServeHTTP(w, r.WithContext(ctx))
}

// FetchMarkets operation middleware
func (siw *ServerInterfaceWrapper) FetchMarkets(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var handler http.Handler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.FetchMarkets(w, r)
	})

	for i := len(siw.HandlerMiddlewares) - 1; i >= 0; i-- {
		handler = siw.HandlerMiddlewares[i](handler)
	}

	handler.ServeHTTP(w, r.WithContext(ctx))
}

// FetchMarket operation middleware
func (siw *ServerInterfaceWrapper) FetchMarket(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var err error

	// ------------- Path parameter "id" -------------
	var id int

	err = runtime.BindStyledParameterWithLocation("simple", false, "id", runtime.ParamLocationPath, chi.URLParam(r, "id"), &id)
	if err != nil {
		siw.ErrorHandlerFunc(w, r, &InvalidParamFormatError{ParamName: "id", Err: err})
		return
	}

	var handler http.Handler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		siw.Handler.FetchMarket(w, r, id)
	})

	for i := len(siw.HandlerMiddlewares) - 1; i >= 0; i-- {
		handler = siw.HandlerMiddlewares[i](handler)
	}

	handler.ServeHTTP(w, r.WithContext(ctx))
}

type UnescapedCookieParamError struct {
	ParamName string
	Err       error
}

func (e *UnescapedCookieParamError) Error() string {
	return fmt.Sprintf("error unescaping cookie parameter '%s'", e.ParamName)
}

func (e *UnescapedCookieParamError) Unwrap() error {
	return e.Err
}

type UnmarshallingParamError struct {
	ParamName string
	Err       error
}

func (e *UnmarshallingParamError) Error() string {
	return fmt.Sprintf("Error unmarshalling parameter %s as JSON: %s", e.ParamName, e.Err.Error())
}

func (e *UnmarshallingParamError) Unwrap() error {
	return e.Err
}

type RequiredParamError struct {
	ParamName string
}

func (e *RequiredParamError) Error() string {
	return fmt.Sprintf("Query argument %s is required, but not found", e.ParamName)
}

type RequiredHeaderError struct {
	ParamName string
	Err       error
}

func (e *RequiredHeaderError) Error() string {
	return fmt.Sprintf("Header parameter %s is required, but not found", e.ParamName)
}

func (e *RequiredHeaderError) Unwrap() error {
	return e.Err
}

type InvalidParamFormatError struct {
	ParamName string
	Err       error
}

func (e *InvalidParamFormatError) Error() string {
	return fmt.Sprintf("Invalid format for parameter %s: %s", e.ParamName, e.Err.Error())
}

func (e *InvalidParamFormatError) Unwrap() error {
	return e.Err
}

type TooManyValuesForParamError struct {
	ParamName string
	Count     int
}

func (e *TooManyValuesForParamError) Error() string {
	return fmt.Sprintf("Expected one value for %s, got %d", e.ParamName, e.Count)
}

// Handler creates http.Handler with routing matching OpenAPI spec.
func Handler(si ServerInterface) http.Handler {
	return HandlerWithOptions(si, ChiServerOptions{})
}

type ChiServerOptions struct {
	BaseURL          string
	BaseRouter       chi.Router
	Middlewares      []MiddlewareFunc
	ErrorHandlerFunc func(w http.ResponseWriter, r *http.Request, err error)
}

// HandlerFromMux creates http.Handler with routing matching OpenAPI spec based on the provided mux.
func HandlerFromMux(si ServerInterface, r chi.Router) http.Handler {
	return HandlerWithOptions(si, ChiServerOptions{
		BaseRouter: r,
	})
}

func HandlerFromMuxWithBaseURL(si ServerInterface, r chi.Router, baseURL string) http.Handler {
	return HandlerWithOptions(si, ChiServerOptions{
		BaseURL:    baseURL,
		BaseRouter: r,
	})
}

// HandlerWithOptions creates http.Handler with additional options
func HandlerWithOptions(si ServerInterface, options ChiServerOptions) http.Handler {
	r := options.BaseRouter

	if r == nil {
		r = chi.NewRouter()
	}
	if options.ErrorHandlerFunc == nil {
		options.ErrorHandlerFunc = func(w http.ResponseWriter, r *http.Request, err error) {
			http.Error(w, err.Error(), http.StatusBadRequest)
		}
	}
	wrapper := ServerInterfaceWrapper{
		Handler:            si,
		HandlerMiddlewares: options.Middlewares,
		ErrorHandlerFunc:   options.ErrorHandlerFunc,
	}

	r.Group(func(r chi.Router) {
		r.Get(options.BaseURL+"/api/v1/companies", wrapper.FetchCompanies)
	})
	r.Group(func(r chi.Router) {
		r.Get(options.BaseURL+"/api/v1/companies/{code}", wrapper.FetchCompany)
	})
	r.Group(func(r chi.Router) {
		r.Get(options.BaseURL+"/api/v1/company_ids", wrapper.FetchCompanyIds)
	})
	r.Group(func(r chi.Router) {
		r.Get(options.BaseURL+"/api/v1/industries", wrapper.FetchIndustries)
	})
	r.Group(func(r chi.Router) {
		r.Get(options.BaseURL+"/api/v1/industries/{id}", wrapper.FetchIndustry)
	})
	r.Group(func(r chi.Router) {
		r.Get(options.BaseURL+"/api/v1/industry_ids", wrapper.FetchIndustryIds)
	})
	r.Group(func(r chi.Router) {
		r.Get(options.BaseURL+"/api/v1/market_ids", wrapper.FetchMarketIds)
	})
	r.Group(func(r chi.Router) {
		r.Get(options.BaseURL+"/api/v1/markets", wrapper.FetchMarkets)
	})
	r.Group(func(r chi.Router) {
		r.Get(options.BaseURL+"/api/v1/markets/{id}", wrapper.FetchMarket)
	})

	return r
}

// Base64 encoded, gzipped, json marshaled Swagger object
var swaggerSpec = []string{

	"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",
	"AAA=",
}

// GetSwagger returns the content of the embedded swagger specification file
// or error if failed to decode
func decodeSpec() ([]byte, error) {
	zipped, err := base64.StdEncoding.DecodeString(strings.Join(swaggerSpec, ""))
	if err != nil {
		return nil, fmt.Errorf("error base64 decoding spec: %s", err)
	}
	zr, err := gzip.NewReader(bytes.NewReader(zipped))
	if err != nil {
		return nil, fmt.Errorf("error decompressing spec: %s", err)
	}
	var buf bytes.Buffer
	_, err = buf.ReadFrom(zr)
	if err != nil {
		return nil, fmt.Errorf("error decompressing spec: %s", err)
	}

	return buf.Bytes(), nil
}

var rawSpec = decodeSpecCached()

// a naive cached of a decoded swagger spec
func decodeSpecCached() func() ([]byte, error) {
	data, err := decodeSpec()
	return func() ([]byte, error) {
		return data, err
	}
}

// Constructs a synthetic filesystem for resolving external references when loading openapi specifications.
func PathToRawSpec(pathToFile string) map[string]func() ([]byte, error) {
	var res = make(map[string]func() ([]byte, error))
	if len(pathToFile) > 0 {
		res[pathToFile] = rawSpec
	}

	return res
}

// GetSwagger returns the Swagger specification corresponding to the generated code
// in this file. The external references of Swagger specification are resolved.
// The logic of resolving external references is tightly connected to "import-mapping" feature.
// Externally referenced files must be embedded in the corresponding golang packages.
// Urls can be supported but this task was out of the scope.
func GetSwagger() (swagger *openapi3.T, err error) {
	var resolvePath = PathToRawSpec("")

	loader := openapi3.NewLoader()
	loader.IsExternalRefsAllowed = true
	loader.ReadFromURIFunc = func(loader *openapi3.Loader, url *url.URL) ([]byte, error) {
		var pathToFile = url.String()
		pathToFile = path.Clean(pathToFile)
		getSpec, ok := resolvePath[pathToFile]
		if !ok {
			err1 := fmt.Errorf("path not found: %s", pathToFile)
			return nil, err1
		}
		return getSpec()
	}
	var specData []byte
	specData, err = rawSpec()
	if err != nil {
		return
	}
	swagger, err = loader.LoadFromData(specData)
	if err != nil {
		return
	}
	return
}
