package models

// Code generated by xo. DO NOT EDIT.

import (
	"context"
	"database/sql"
)

// Industry represents a row from 'public.industries'.
type Industry struct {
	ID                 int64         `json:"id"`                   // id
	Name               string        `json:"name"`                 // name
	Code               int           `json:"code"`                 // code
	IndustryCategoryID sql.NullInt64 `json:"industry_category_id"` // industry_category_id
	// xo fields
	_exists, _deleted bool
}

// Exists returns true when the [Industry] exists in the database.
func (i *Industry) Exists() bool {
	return i._exists
}

// Deleted returns true when the [Industry] has been marked for deletion
// from the database.
func (i *Industry) Deleted() bool {
	return i._deleted
}

// Insert inserts the [Industry] to the database.
func (i *Industry) Insert(ctx context.Context, db DB) error {
	switch {
	case i._exists: // already exists
		return logerror(&ErrInsertFailed{ErrAlreadyExists})
	case i._deleted: // deleted
		return logerror(&ErrInsertFailed{ErrMarkedForDeletion})
	}
	// insert (primary key generated and returned by database)
	const sqlstr = `INSERT INTO public.industries (` +
		`name, code, industry_category_id` +
		`) VALUES (` +
		`$1, $2, $3` +
		`) RETURNING id`
	// run
	logf(sqlstr, i.Name, i.Code, i.IndustryCategoryID)
	if err := db.QueryRowContext(ctx, sqlstr, i.Name, i.Code, i.IndustryCategoryID).Scan(&i.ID); err != nil {
		return logerror(err)
	}
	// set exists
	i._exists = true
	return nil
}

// Update updates a [Industry] in the database.
func (i *Industry) Update(ctx context.Context, db DB) error {
	switch {
	case !i._exists: // doesn't exist
		return logerror(&ErrUpdateFailed{ErrDoesNotExist})
	case i._deleted: // deleted
		return logerror(&ErrUpdateFailed{ErrMarkedForDeletion})
	}
	// update with composite primary key
	const sqlstr = `UPDATE public.industries SET ` +
		`name = $1, code = $2, industry_category_id = $3 ` +
		`WHERE id = $4`
	// run
	logf(sqlstr, i.Name, i.Code, i.IndustryCategoryID, i.ID)
	if _, err := db.ExecContext(ctx, sqlstr, i.Name, i.Code, i.IndustryCategoryID, i.ID); err != nil {
		return logerror(err)
	}
	return nil
}

// Save saves the [Industry] to the database.
func (i *Industry) Save(ctx context.Context, db DB) error {
	if i.Exists() {
		return i.Update(ctx, db)
	}
	return i.Insert(ctx, db)
}

// Upsert performs an upsert for [Industry].
func (i *Industry) Upsert(ctx context.Context, db DB) error {
	switch {
	case i._deleted: // deleted
		return logerror(&ErrUpsertFailed{ErrMarkedForDeletion})
	}
	// upsert
	const sqlstr = `INSERT INTO public.industries (` +
		`id, name, code, industry_category_id` +
		`) VALUES (` +
		`$1, $2, $3, $4` +
		`)` +
		` ON CONFLICT (id) DO ` +
		`UPDATE SET ` +
		`name = EXCLUDED.name, code = EXCLUDED.code, industry_category_id = EXCLUDED.industry_category_id `
	// run
	logf(sqlstr, i.ID, i.Name, i.Code, i.IndustryCategoryID)
	if _, err := db.ExecContext(ctx, sqlstr, i.ID, i.Name, i.Code, i.IndustryCategoryID); err != nil {
		return logerror(err)
	}
	// set exists
	i._exists = true
	return nil
}

// Delete deletes the [Industry] from the database.
func (i *Industry) Delete(ctx context.Context, db DB) error {
	switch {
	case !i._exists: // doesn't exist
		return nil
	case i._deleted: // deleted
		return nil
	}
	// delete with single primary key
	const sqlstr = `DELETE FROM public.industries ` +
		`WHERE id = $1`
	// run
	logf(sqlstr, i.ID)
	if _, err := db.ExecContext(ctx, sqlstr, i.ID); err != nil {
		return logerror(err)
	}
	// set deleted
	i._deleted = true
	return nil
}

// IndustryByCode retrieves a row from 'public.industries' as a [Industry].
//
// Generated from index 'index_industries_on_code'.
func IndustryByCode(ctx context.Context, db DB, code int) (*Industry, error) {
	// query
	const sqlstr = `SELECT ` +
		`id, name, code, industry_category_id ` +
		`FROM public.industries ` +
		`WHERE code = $1`
	// run
	logf(sqlstr, code)
	i := Industry{
		_exists: true,
	}
	if err := db.QueryRowContext(ctx, sqlstr, code).Scan(&i.ID, &i.Name, &i.Code, &i.IndustryCategoryID); err != nil {
		return nil, logerror(err)
	}
	return &i, nil
}

// IndustriesByIndustryCategoryID retrieves a row from 'public.industries' as a [Industry].
//
// Generated from index 'index_industries_on_industry_category_id'.
func IndustriesByIndustryCategoryID(ctx context.Context, db DB, industryCategoryID sql.NullInt64) ([]*Industry, error) {
	// query
	const sqlstr = `SELECT ` +
		`id, name, code, industry_category_id ` +
		`FROM public.industries ` +
		`WHERE industry_category_id = $1`
	// run
	logf(sqlstr, industryCategoryID)
	rows, err := db.QueryContext(ctx, sqlstr, industryCategoryID)
	if err != nil {
		return nil, logerror(err)
	}
	defer rows.Close()
	// process
	var res []*Industry
	for rows.Next() {
		i := Industry{
			_exists: true,
		}
		// scan
		if err := rows.Scan(&i.ID, &i.Name, &i.Code, &i.IndustryCategoryID); err != nil {
			return nil, logerror(err)
		}
		res = append(res, &i)
	}
	if err := rows.Err(); err != nil {
		return nil, logerror(err)
	}
	return res, nil
}

// IndustryByName retrieves a row from 'public.industries' as a [Industry].
//
// Generated from index 'index_industries_on_name'.
func IndustryByName(ctx context.Context, db DB, name string) (*Industry, error) {
	// query
	const sqlstr = `SELECT ` +
		`id, name, code, industry_category_id ` +
		`FROM public.industries ` +
		`WHERE name = $1`
	// run
	logf(sqlstr, name)
	i := Industry{
		_exists: true,
	}
	if err := db.QueryRowContext(ctx, sqlstr, name).Scan(&i.ID, &i.Name, &i.Code, &i.IndustryCategoryID); err != nil {
		return nil, logerror(err)
	}
	return &i, nil
}

// IndustryByID retrieves a row from 'public.industries' as a [Industry].
//
// Generated from index 'industries_pkey'.
func IndustryByID(ctx context.Context, db DB, id int64) (*Industry, error) {
	// query
	const sqlstr = `SELECT ` +
		`id, name, code, industry_category_id ` +
		`FROM public.industries ` +
		`WHERE id = $1`
	// run
	logf(sqlstr, id)
	i := Industry{
		_exists: true,
	}
	if err := db.QueryRowContext(ctx, sqlstr, id).Scan(&i.ID, &i.Name, &i.Code, &i.IndustryCategoryID); err != nil {
		return nil, logerror(err)
	}
	return &i, nil
}
