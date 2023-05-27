// Package models contains generated code for schema 'public'.
package models

// Code generated by xo. DO NOT EDIT.

import (
	"context"
	"database/sql"
	"time"
)

// ArInternalMetadatum represents a row from 'public.ar_internal_metadata'.
type ArInternalMetadatum struct {
	Key       string                    `json:"key"`        // key
	Value     sql.NullString            `json:"value"`      // value
	CreatedAt time.Time `json:"created_at"` // created_at
	UpdatedAt time.Time `json:"updated_at"` // updated_at
	// xo fields
	_exists, _deleted bool
}

// Exists returns true when the [ArInternalMetadatum] exists in the database.
func (aim *ArInternalMetadatum) Exists() bool {
	return aim._exists
}

// Deleted returns true when the [ArInternalMetadatum] has been marked for deletion
// from the database.
func (aim *ArInternalMetadatum) Deleted() bool {
	return aim._deleted
}

// Insert inserts the [ArInternalMetadatum] to the database.
func (aim *ArInternalMetadatum) Insert(ctx context.Context, db DB) error {
	switch {
	case aim._exists: // already exists
		return logerror(&ErrInsertFailed{ErrAlreadyExists})
	case aim._deleted: // deleted
		return logerror(&ErrInsertFailed{ErrMarkedForDeletion})
	}
	// insert (manual)
	const sqlstr = `INSERT INTO public.ar_internal_metadata (` +
		`key, value, created_at, updated_at` +
		`) VALUES (` +
		`$1, $2, $3, $4` +
		`)`
	// run
	logf(sqlstr, aim.Key, aim.Value, aim.CreatedAt, aim.UpdatedAt)
	if _, err := db.ExecContext(ctx, sqlstr, aim.Key, aim.Value, aim.CreatedAt, aim.UpdatedAt); err != nil {
		return logerror(err)
	}
	// set exists
	aim._exists = true
	return nil
}

// Update updates a [ArInternalMetadatum] in the database.
func (aim *ArInternalMetadatum) Update(ctx context.Context, db DB) error {
	switch {
	case !aim._exists: // doesn't exist
		return logerror(&ErrUpdateFailed{ErrDoesNotExist})
	case aim._deleted: // deleted
		return logerror(&ErrUpdateFailed{ErrMarkedForDeletion})
	}
	// update with composite primary key
	const sqlstr = `UPDATE public.ar_internal_metadata SET ` +
		`value = $1, created_at = $2, updated_at = $3 ` +
		`WHERE key = $4`
	// run
	logf(sqlstr, aim.Value, aim.CreatedAt, aim.UpdatedAt, aim.Key)
	if _, err := db.ExecContext(ctx, sqlstr, aim.Value, aim.CreatedAt, aim.UpdatedAt, aim.Key); err != nil {
		return logerror(err)
	}
	return nil
}

// Save saves the [ArInternalMetadatum] to the database.
func (aim *ArInternalMetadatum) Save(ctx context.Context, db DB) error {
	if aim.Exists() {
		return aim.Update(ctx, db)
	}
	return aim.Insert(ctx, db)
}

// Upsert performs an upsert for [ArInternalMetadatum].
func (aim *ArInternalMetadatum) Upsert(ctx context.Context, db DB) error {
	switch {
	case aim._deleted: // deleted
		return logerror(&ErrUpsertFailed{ErrMarkedForDeletion})
	}
	// upsert
	const sqlstr = `INSERT INTO public.ar_internal_metadata (` +
		`key, value, created_at, updated_at` +
		`) VALUES (` +
		`$1, $2, $3, $4` +
		`)` +
		` ON CONFLICT (key) DO ` +
		`UPDATE SET ` +
		`value = EXCLUDED.value, created_at = EXCLUDED.created_at, updated_at = EXCLUDED.updated_at `
	// run
	logf(sqlstr, aim.Key, aim.Value, aim.CreatedAt, aim.UpdatedAt)
	if _, err := db.ExecContext(ctx, sqlstr, aim.Key, aim.Value, aim.CreatedAt, aim.UpdatedAt); err != nil {
		return logerror(err)
	}
	// set exists
	aim._exists = true
	return nil
}

// Delete deletes the [ArInternalMetadatum] from the database.
func (aim *ArInternalMetadatum) Delete(ctx context.Context, db DB) error {
	switch {
	case !aim._exists: // doesn't exist
		return nil
	case aim._deleted: // deleted
		return nil
	}
	// delete with single primary key
	const sqlstr = `DELETE FROM public.ar_internal_metadata ` +
		`WHERE key = $1`
	// run
	logf(sqlstr, aim.Key)
	if _, err := db.ExecContext(ctx, sqlstr, aim.Key); err != nil {
		return logerror(err)
	}
	// set deleted
	aim._deleted = true
	return nil
}

// ArInternalMetadatumByKey retrieves a row from 'public.ar_internal_metadata' as a [ArInternalMetadatum].
//
// Generated from index 'ar_internal_metadata_pkey'.
func ArInternalMetadatumByKey(ctx context.Context, db DB, key string) (*ArInternalMetadatum, error) {
	// query
	const sqlstr = `SELECT ` +
		`key, value, created_at, updated_at ` +
		`FROM public.ar_internal_metadata ` +
		`WHERE key = $1`
	// run
	logf(sqlstr, key)
	aim := ArInternalMetadatum{
		_exists: true,
	}
	if err := db.QueryRowContext(ctx, sqlstr, key).Scan(&aim.Key, &aim.Value, &aim.CreatedAt, &aim.UpdatedAt); err != nil {
		return nil, logerror(err)
	}
	return &aim, nil
}
