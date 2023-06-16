package models

import (
	"context"
	"database/sql"
	"fmt"
)

type SecurityData struct {
	ID                  int64
	Name                string
	Code                int
	IndustryName        string
	MarketName          string
	NetSales            *int64
	AverageAnnualSalary *int64
	OrdinaryIncome      *int64
}

// SecurityListPagination returns a slice of SecurityData.
func SecurityListPagination(ctx context.Context, db DB, limit, offset int, sortType string, industryId, marketId, code *int, query *string) ([]*SecurityData, error) {
	rows, err := securityListQuery(ctx, db, baseSelectQuery, limit, offset, sortType, industryId, marketId, code, query)
	if err != nil {
		return nil, logerror(err)
	}
	defer rows.Close()
	// process
	datum := []*SecurityData{}
	for rows.Next() {
		var data SecurityData
		err := rows.Scan(&data.ID, &data.Code, &data.Name, &data.IndustryName, &data.MarketName, &data.NetSales, &data.AverageAnnualSalary, &data.OrdinaryIncome)
		if err != nil {
			return nil, logerror(err)
		}
		datum = append(datum, &data)
	}

	return datum, nil
}

var baseSelectQuery = `
SELECT securities.id, securities.code, securities.name, industries.name, markets.name, documents.net_sales, documents.average_annual_salary, documents.ordinary_income
FROM securities
INNER JOIN documents ON documents.security_code = securities.code
INNER JOIN industries ON industries.code = securities.industry_code
INNER JOIN markets ON markets.id = securities.market_id
`

var baseCountQuery = `
SELECT DISTINCT securities.id
FROM securities
INNER JOIN documents ON documents.security_code = securities.code
INNER JOIN industries ON industries.code = securities.industry_code
INNER JOIN markets ON markets.id = securities.market_id
`

var marketQuery1 = `
WHERE markets.id = $1
`

var marketCodeQuery12 = `
WHERE markets.id = $1 AND securities.code = $2
`

var marketQueryQuery123 = `
WHERE markets.id = $1 AND (documents.company_name ILIKE $2 OR documents.company_name_en ILIKE $3)
`

var industryQuery1 = `
WHERE industries.id = $1
`

var industryCodeQuery12 = `
WHERE industries.id = $1 AND securities.code = $2
`

var industryQueryQuery123 = `
WHERE industries.id = $1 AND (documents.company_name ILIKE $2 OR documents.company_name_en ILIKE $3)
`

var codeQuery1 = `
WHERE securities.code = $1
`

var queryQuery12 = `
WHERE documents.company_name ILIKE $1 OR documents.company_name_en ILIKE $2
`

var orderQuery123 = `
ORDER BY
CASE $1
WHEN 'net_sales' THEN documents.net_sales
WHEN 'average_annual_salary' THEN documents.average_annual_salary
WHEN 'ordinary_income' THEN documents.ordinary_income
END DESC NULLS LAST
LIMIT $2 OFFSET $3
`

var orderQuery234 = `
ORDER BY
CASE $2
WHEN 'net_sales' THEN documents.net_sales
WHEN 'average_annual_salary' THEN documents.average_annual_salary
WHEN 'ordinary_income' THEN documents.ordinary_income
END DESC NULLS LAST
LIMIT $3 OFFSET $4
`

var orderQuery345 = `
ORDER BY
CASE $3
WHEN 'net_sales' THEN documents.net_sales
WHEN 'average_annual_salary' THEN documents.average_annual_salary
WHEN 'ordinary_income' THEN documents.ordinary_income
END DESC NULLS LAST
LIMIT $4 OFFSET $5
`

var orderQuery456 = `
ORDER BY
CASE $4
WHEN 'net_sales' THEN documents.net_sales
WHEN 'average_annual_salary' THEN documents.average_annual_salary
WHEN 'ordinary_income' THEN documents.ordinary_income
END DESC NULLS LAST
LIMIT $5 OFFSET $6
`

func securityListQuery(ctx context.Context, db DB, baseQuery string, limit, offset int, sortType string, industryId, marketId, code *int, query *string) (*sql.Rows, error) {
	sqlstr := baseQuery

	if marketId != nil {
		if code != nil {
			sqlstr = sqlstr + marketCodeQuery12 + orderQuery345
			logf(sqlstr, *marketId, *code, sortType, limit, offset)
			return db.QueryContext(ctx, sqlstr, *marketId, *code, sortType, limit, offset)
		} else if query != nil && *query != "" {
			sqlstr = sqlstr + marketQueryQuery123 + orderQuery456
			logf(sqlstr, *marketId, *query, *query, sortType, limit, offset)
			return db.QueryContext(ctx, sqlstr, *marketId, fmt.Sprintf("%%%s%%", *query), fmt.Sprintf("%%%s%%", *query), sortType, limit, offset)
		} else {
			sqlstr = sqlstr + marketQuery1 + orderQuery234
			logf(sqlstr, *marketId, sortType, limit, offset)
			return db.QueryContext(ctx, sqlstr, *marketId, sortType, limit, offset)
		}
	} else if industryId != nil {
		if code != nil {
			sqlstr = sqlstr + industryCodeQuery12 + orderQuery345
			logf(sqlstr, *industryId, *code, sortType, limit, offset)
			return db.QueryContext(ctx, sqlstr, *industryId, *code, sortType, limit, offset)
		} else if query != nil && *query != "" {
			sqlstr = sqlstr + industryQueryQuery123 + orderQuery456
			logf(sqlstr, *industryId, *query, *query, sortType, limit, offset)
			return db.QueryContext(ctx, sqlstr, *industryId, fmt.Sprintf("%%%s%%", *query), fmt.Sprintf("%%%s%%", *query), sortType, limit, offset)
		} else {
			sqlstr = sqlstr + industryQuery1 + orderQuery234
			logf(sqlstr, *industryId, sortType, limit, offset)
			return db.QueryContext(ctx, sqlstr, *industryId, sortType, limit, offset)
		}
	} else {
		if code != nil {
			sqlstr = sqlstr + codeQuery1 + orderQuery234
			logf(sqlstr, *code, sortType, limit, offset)
			return db.QueryContext(ctx, sqlstr, *code, sortType, limit, offset)
		} else if query != nil && *query != "" {
			sqlstr = sqlstr + queryQuery12 + orderQuery345
			logf(sqlstr, *query, *query, sortType, limit, offset)
			return db.QueryContext(ctx, sqlstr, fmt.Sprintf("%%%s%%", *query), fmt.Sprintf("%%%s%%", *query), sortType, limit, offset)
		} else {
			sqlstr = sqlstr + orderQuery123
			logf(sqlstr, sortType, limit, offset)
			return db.QueryContext(ctx, sqlstr, sortType, limit, offset)
		}
	}
}

// SecurityCount returns a slice of SecurityData.
func SecurityListCount(ctx context.Context, db DB, industryId, marketId, code *int, query *string) (int, error) {
	var count int
	row := securityListCountQuery(ctx, db, baseCountQuery, industryId, marketId, code, query)
	err := row.Scan(&count)
	if err != nil {
		return 0, logerror(err)
	}
	return count, nil
}

func securityListCountQuery(ctx context.Context, db DB, baseQuery string, industryId, marketId, code *int, query *string) *sql.Row {
	sqlstr := baseQuery

	if marketId != nil {
		if code != nil {
			sqlstr = countQuery(sqlstr + marketCodeQuery12)
			logf(sqlstr, *marketId, *code)
			return db.QueryRowContext(ctx, sqlstr, *marketId, *code)
		} else if query != nil && *query != "" {
			sqlstr = countQuery(sqlstr + marketQueryQuery123)
			logf(sqlstr, *marketId, *query, *query)
			return db.QueryRowContext(ctx, sqlstr, *marketId, fmt.Sprintf("%%%s%%", *query), fmt.Sprintf("%%%s%%", *query))
		} else {
			sqlstr = countQuery(sqlstr + marketQuery1)
			logf(sqlstr, *marketId)
			return db.QueryRowContext(ctx, sqlstr, *marketId)
		}
	} else if industryId != nil {
		if code != nil {
			sqlstr = countQuery(sqlstr + industryCodeQuery12)
			logf(sqlstr, *industryId, *code)
			return db.QueryRowContext(ctx, sqlstr, *industryId, *code)
		} else if query != nil && *query != "" {
			sqlstr = countQuery(sqlstr + industryQueryQuery123)
			logf(sqlstr, *industryId, *query, *query)
			return db.QueryRowContext(ctx, sqlstr, *industryId, fmt.Sprintf("%%%s%%", *query), fmt.Sprintf("%%%s%%", *query))
		} else {
			sqlstr = countQuery(sqlstr + industryQuery1)
			logf(sqlstr, *industryId)
			return db.QueryRowContext(ctx, sqlstr, *industryId)
		}
	} else {
		if code != nil {
			sqlstr = countQuery(sqlstr + codeQuery1)
			logf(sqlstr, *code)
			return db.QueryRowContext(ctx, sqlstr, *code)
		} else if query != nil && *query != "" {
			sqlstr = countQuery(sqlstr + queryQuery12)
			logf(sqlstr, *query, *query)
			return db.QueryRowContext(ctx, sqlstr, fmt.Sprintf("%%%s%%", *query), fmt.Sprintf("%%%s%%", *query))
		} else {
			sqlstr = countQuery(sqlstr)
			logf(sqlstr)
			return db.QueryRowContext(ctx, sqlstr)
		}
	}
}

func countQuery(sqlstr string) string {
	return "SELECT COUNT(*) FROM ( " + sqlstr + " ) AS count"
}

// SecurityCountByIndustry returns a map of industry code to security count.
func SecurityCountByIndustry(ctx context.Context, db DB) (map[int]int, error) {
	// query
	const sqlstr = `SELECT ` +
		`COUNT(*) AS count_all, securities.industry_code AS securities_industry_code ` +
		`FROM securities ` +
		`INNER JOIN documents ` +
		`ON documents.security_code = securities.code ` +
		`GROUP BY securities.industry_code`
	// run
	logf(sqlstr)
	rows, err := db.QueryContext(ctx, sqlstr)
	if err != nil {
		return nil, logerror(err)
	}
	defer rows.Close()
	// process
	var counts map[int]int = make(map[int]int)
	for rows.Next() {
		var count, code int
		err := rows.Scan(&count, &code)
		if err != nil {
			return nil, logerror(err)
		}
		counts[code] = count
	}
	if err := rows.Err(); err != nil {
		return nil, logerror(err)
	}
	return counts, nil
}

// SecurityCountByMarket returns a map of industry code to security count.
func SecurityCountByMarket(ctx context.Context, db DB) (map[int]int, error) {
	// query
	const sqlstr = `SELECT ` +
		`COUNT(*) AS count_all, securities.market_id AS securities_market_id ` +
		`FROM securities ` +
		`INNER JOIN documents ` +
		`ON documents.security_code = securities.code ` +
		`GROUP BY securities.market_id`
	// run
	logf(sqlstr)
	rows, err := db.QueryContext(ctx, sqlstr)
	if err != nil {
		return nil, logerror(err)
	}
	defer rows.Close()
	// process
	var counts map[int]int = make(map[int]int)
	for rows.Next() {
		var count, id int
		err := rows.Scan(&count, &id)
		if err != nil {
			return nil, logerror(err)
		}
		counts[id] = count
	}
	if err := rows.Err(); err != nil {
		return nil, logerror(err)
	}
	return counts, nil
}
