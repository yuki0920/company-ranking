package models

import "context"

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
func SecurityListPagination(ctx context.Context, db DB, limit, offset int) ([]*SecurityData, error) {
	// query
	const sqlstr = `
	SELECT securities.id, securities.code, securities.name, industries.name, markets.name, documents.net_sales, documents.average_annual_salary, documents.ordinary_income
	FROM securities
	INNER JOIN documents ON documents.security_code = securities.code
	INNER JOIN industries ON industries.code = securities.industry_code
	INNER JOIN markets ON markets.id = securities.market_id
	ORDER BY documents.net_sales DESC NULLS LAST LIMIT $1 OFFSET $2
	`
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
func SecurityListCount(ctx context.Context, db DB) (int, error) {
	// query
	const sqlstr = `
	SELECT COUNT(*) FROM
	(SELECT DISTINCT "securities"."id"
	FROM "securities"
	INNER JOIN "documents" ON "documents"."security_code" = "securities"."code"
	INNER JOIN "industries" ON "industries"."code" = "securities"."industry_code"
	INNER JOIN "markets" ON "markets"."id" = "securities"."market_id") subquery_for_count
	`
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
