package models

import "context"

// SecurityCountByIndustry returns
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
