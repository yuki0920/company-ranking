package models

import (
	"context"
)

// IndustryCategoryALL returns a slice of all IndustryCategory.
func IndustryCategoryALL(ctx context.Context, db DB) ([]*IndustryCategory, error) {
	// query
	const sqlstr = `SELECT ` +
		`id, name ` +
		`FROM public.industry_categories`
	// run
	logf(sqlstr)
	rows, err := db.QueryContext(ctx, sqlstr)
	if err != nil {
		return nil, logerror(err)
	}
	defer rows.Close()
	// process
	var categories []*IndustryCategory
	for rows.Next() {
		var category IndustryCategory
		err := rows.Scan(&category.ID, &category.Name)
		if err != nil {
			return nil, logerror(err)
		}
		categories = append(categories, &category)
	}
	if err := rows.Err(); err != nil {
		return nil, logerror(err)
	}
	return categories, nil
}
