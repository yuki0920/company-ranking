package models

import (
	"context"
)

// MarketIDs returns a slice of all Market IDs.
func MarketIDs(ctx context.Context, db DB) ([]int64, error) {
	// query
	const sqlstr = `SELECT ` +
		`id ` +
		`FROM public.markets`
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

// MarketALL returns a slice of all Market.
func MarketALL(ctx context.Context, db DB) ([]*Market, error) {
	// query
	const sqlstr = `SELECT ` +
		`id, name ` +
		`FROM public.markets`
	// run
	logf(sqlstr)
	rows, err := db.QueryContext(ctx, sqlstr)
	if err != nil {
		return nil, logerror(err)
	}
	defer rows.Close()
	// process
	var markets []*Market
	for rows.Next() {
		var market Market
		err := rows.Scan(&market.ID, &market.Name)
		if err != nil {
			return nil, logerror(err)
		}
		markets = append(markets, &market)
	}
	if err := rows.Err(); err != nil {
		return nil, logerror(err)
	}
	return markets, nil
}
