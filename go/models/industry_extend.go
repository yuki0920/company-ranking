package models

import (
	"context"
)

// IndustriesIDs returns a slice of all Industry IDs.
func IndustryIDs(ctx context.Context, db DB) ([]int64, error) {
	// query
	const sqlstr = `SELECT ` +
		`id ` +
		`FROM public.industries`
	// run
	logf(sqlstr)
	rows, err := db.QueryContext(ctx, sqlstr)
	if err != nil {
		return nil, logerror(err)
	}
	defer rows.Close()

	// process
	var ids []int64
	for rows.Next() {
		var id int64
		err := rows.Scan(&id)
		if err != nil {
			return nil, logerror(err)
		}
		ids = append(ids, id)
	}
	if err := rows.Err(); err != nil {
		return nil, logerror(err)
	}
	return ids, nil
}

// IndustryALL returns a slice of all Industry.
func IndustryALL(ctx context.Context, db DB) ([]*Industry, error) {
	// query
	const sqlstr = `SELECT ` +
		`id, name, code, industry_category_id ` +
		`FROM public.industries`
	// run
	logf(sqlstr)
	rows, err := db.QueryContext(ctx, sqlstr)
	if err != nil {
		return nil, logerror(err)
	}
	defer rows.Close()
	// process
	var industries []*Industry
	for rows.Next() {
		var industry Industry
		err := rows.Scan(&industry.ID, &industry.Name, &industry.Code, &industry.IndustryCategoryID)
		if err != nil {
			return nil, logerror(err)
		}
		industries = append(industries, &industry)
	}
	if err := rows.Err(); err != nil {
		return nil, logerror(err)
	}
	return industries, nil
}
