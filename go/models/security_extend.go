package models

import (
	"context"
	"fmt"
	"strings"
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
	// query
	sqlstr := `
	SELECT securities.id, securities.code, securities.name, industries.name, markets.name, documents.net_sales, documents.average_annual_salary, documents.ordinary_income
	FROM securities
	INNER JOIN documents ON documents.security_code = securities.code
	INNER JOIN industries ON industries.code = securities.industry_code
	INNER JOIN markets ON markets.id = securities.market_id
	@where
	ORDER BY documents.@sort_type DESC NULLS LAST LIMIT $1 OFFSET $2
	`
	sqlstr = strings.Replace(sqlstr, "@sort_type", sortType, 1)
	if industryId != nil {
		where := fmt.Sprintf("WHERE industries.id = %d", *industryId)
		sqlstr = strings.Replace(sqlstr, "@where", where, 1)
	} else if marketId != nil {
		where := fmt.Sprintf("WHERE markets.id = %d", *marketId)
		sqlstr = strings.Replace(sqlstr, "@where", where, 1)
	} else if code != nil {
		where := fmt.Sprintf("WHERE securities.code = %d", *code)
		sqlstr = strings.Replace(sqlstr, "@where", where, 1)
	} else if query != nil {
		where := fmt.Sprintf("WHERE documents.company_name ILIKE '%%%s%%' OR documents.company_name_en ILIKE '%%%s%%'", *query, *query)
		sqlstr = strings.Replace(sqlstr, "@where", where, 1)
	} else {
		sqlstr = strings.Replace(sqlstr, "@where", "", 1)
	}

	// run
	logf(sqlstr, limit, offset)
	rows, err := db.QueryContext(ctx, sqlstr, limit, offset)
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

// SecurityCount returns a slice of SecurityData.
func SecurityListCount(ctx context.Context, db DB, industryId, marketId, code *int, query *string) (int, error) {
	// query
	sqlstr := `
	SELECT COUNT(*) FROM
	(
		SELECT DISTINCT securities.id
		FROM securities
		INNER JOIN documents ON documents.security_code = securities.code
		INNER JOIN industries ON industries.code = securities.industry_code
		INNER JOIN markets ON markets.id = securities.market_id
		@where
	) subquery_for_count
	`
	if industryId != nil {
		where := fmt.Sprintf("WHERE industries.id = %d", *industryId)
		sqlstr = strings.Replace(sqlstr, "@where", where, 1)
	} else if marketId != nil {
		where := fmt.Sprintf("WHERE markets.id = %d", *marketId)
		sqlstr = strings.Replace(sqlstr, "@where", where, 1)
	} else if code != nil {
		where := fmt.Sprintf("WHERE securities.code = %d", *code)
		sqlstr = strings.Replace(sqlstr, "@where", where, 1)
	} else if query != nil {
		where := fmt.Sprintf("WHERE documents.company_name ILIKE '%%%s%%' OR documents.company_name_en ILIKE '%%%s%%'", *query, *query)
		sqlstr = strings.Replace(sqlstr, "@where", where, 1)
	} else {
		sqlstr = strings.Replace(sqlstr, "@where", "", 1)
	}
	// run
	logf(sqlstr)
	var count int
	row := db.QueryRowContext(ctx, sqlstr)
	err := row.Scan(&count)
	if err != nil {
		return 0, logerror(err)
	}
	return count, nil
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
