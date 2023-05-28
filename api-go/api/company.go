package api

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/yuki0920/company-ranking/api-go/models"
)

type CompanyAPI struct {
	DB *sql.DB
}

func NewCompanyAPI(db *sql.DB) *CompanyAPI {
	return &CompanyAPI{
		DB: db,
	}
}

func (api *CompanyAPI) FetchCompany(w http.ResponseWriter, r *http.Request, code int) {
	ctx := context.Background()

	sec, err := models.SecurityByCode(ctx, api.DB, code)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	com := Company{
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
		SecurityCode:         float32(sec.Code),
		SecurityId:           float32(sec.ID),
		SecurityName:         sec.Name,
		TotalAssets:          nil,
	}

	res := ResponseCompany{
		Company: com,
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(res)
}
