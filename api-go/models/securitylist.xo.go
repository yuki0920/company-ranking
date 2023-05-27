package models

// Code generated by xo. DO NOT EDIT.

import (
	"context"
	"time"
)

// SecurityList represents a row from 'public.security_lists'.
type SecurityList struct {
	ID           int64                     `json:"id"`            // id
	FileTitle    string                    `json:"file_title"`    // file_title
	DownloadedAt time.Time                 `json:"downloaded_at"` // downloaded_at
	CreatedAt    time.Time `json:"created_at"`    // created_at
	UpdatedAt    time.Time `json:"updated_at"`    // updated_at
	// xo fields
	_exists, _deleted bool
}

// Exists returns true when the [SecurityList] exists in the database.
func (sl *SecurityList) Exists() bool {
	return sl._exists
}

// Deleted returns true when the [SecurityList] has been marked for deletion
// from the database.
func (sl *SecurityList) Deleted() bool {
	return sl._deleted
}

// Insert inserts the [SecurityList] to the database.
func (sl *SecurityList) Insert(ctx context.Context, db DB) error {
	switch {
	case sl._exists: // already exists
		return logerror(&ErrInsertFailed{ErrAlreadyExists})
	case sl._deleted: // deleted
		return logerror(&ErrInsertFailed{ErrMarkedForDeletion})
	}
	// insert (primary key generated and returned by database)
	const sqlstr = `INSERT INTO public.security_lists (` +
		`file_title, downloaded_at, created_at, updated_at` +
		`) VALUES (` +
		`$1, $2, $3, $4` +
		`) RETURNING id`
	// run
	logf(sqlstr, sl.FileTitle, sl.DownloadedAt, sl.CreatedAt, sl.UpdatedAt)
	if err := db.QueryRowContext(ctx, sqlstr, sl.FileTitle, sl.DownloadedAt, sl.CreatedAt, sl.UpdatedAt).Scan(&sl.ID); err != nil {
		return logerror(err)
	}
	// set exists
	sl._exists = true
	return nil
}

// Update updates a [SecurityList] in the database.
func (sl *SecurityList) Update(ctx context.Context, db DB) error {
	switch {
	case !sl._exists: // doesn't exist
		return logerror(&ErrUpdateFailed{ErrDoesNotExist})
	case sl._deleted: // deleted
		return logerror(&ErrUpdateFailed{ErrMarkedForDeletion})
	}
	// update with composite primary key
	const sqlstr = `UPDATE public.security_lists SET ` +
		`file_title = $1, downloaded_at = $2, created_at = $3, updated_at = $4 ` +
		`WHERE id = $5`
	// run
	logf(sqlstr, sl.FileTitle, sl.DownloadedAt, sl.CreatedAt, sl.UpdatedAt, sl.ID)
	if _, err := db.ExecContext(ctx, sqlstr, sl.FileTitle, sl.DownloadedAt, sl.CreatedAt, sl.UpdatedAt, sl.ID); err != nil {
		return logerror(err)
	}
	return nil
}

// Save saves the [SecurityList] to the database.
func (sl *SecurityList) Save(ctx context.Context, db DB) error {
	if sl.Exists() {
		return sl.Update(ctx, db)
	}
	return sl.Insert(ctx, db)
}

// Upsert performs an upsert for [SecurityList].
func (sl *SecurityList) Upsert(ctx context.Context, db DB) error {
	switch {
	case sl._deleted: // deleted
		return logerror(&ErrUpsertFailed{ErrMarkedForDeletion})
	}
	// upsert
	const sqlstr = `INSERT INTO public.security_lists (` +
		`id, file_title, downloaded_at, created_at, updated_at` +
		`) VALUES (` +
		`$1, $2, $3, $4, $5` +
		`)` +
		` ON CONFLICT (id) DO ` +
		`UPDATE SET ` +
		`file_title = EXCLUDED.file_title, downloaded_at = EXCLUDED.downloaded_at, created_at = EXCLUDED.created_at, updated_at = EXCLUDED.updated_at `
	// run
	logf(sqlstr, sl.ID, sl.FileTitle, sl.DownloadedAt, sl.CreatedAt, sl.UpdatedAt)
	if _, err := db.ExecContext(ctx, sqlstr, sl.ID, sl.FileTitle, sl.DownloadedAt, sl.CreatedAt, sl.UpdatedAt); err != nil {
		return logerror(err)
	}
	// set exists
	sl._exists = true
	return nil
}

// Delete deletes the [SecurityList] from the database.
func (sl *SecurityList) Delete(ctx context.Context, db DB) error {
	switch {
	case !sl._exists: // doesn't exist
		return nil
	case sl._deleted: // deleted
		return nil
	}
	// delete with single primary key
	const sqlstr = `DELETE FROM public.security_lists ` +
		`WHERE id = $1`
	// run
	logf(sqlstr, sl.ID)
	if _, err := db.ExecContext(ctx, sqlstr, sl.ID); err != nil {
		return logerror(err)
	}
	// set deleted
	sl._deleted = true
	return nil
}

// SecurityListByFileTitle retrieves a row from 'public.security_lists' as a [SecurityList].
//
// Generated from index 'index_security_lists_on_file_title'.
func SecurityListByFileTitle(ctx context.Context, db DB, fileTitle string) (*SecurityList, error) {
	// query
	const sqlstr = `SELECT ` +
		`id, file_title, downloaded_at, created_at, updated_at ` +
		`FROM public.security_lists ` +
		`WHERE file_title = $1`
	// run
	logf(sqlstr, fileTitle)
	sl := SecurityList{
		_exists: true,
	}
	if err := db.QueryRowContext(ctx, sqlstr, fileTitle).Scan(&sl.ID, &sl.FileTitle, &sl.DownloadedAt, &sl.CreatedAt, &sl.UpdatedAt); err != nil {
		return nil, logerror(err)
	}
	return &sl, nil
}

// SecurityListByID retrieves a row from 'public.security_lists' as a [SecurityList].
//
// Generated from index 'security_lists_pkey'.
func SecurityListByID(ctx context.Context, db DB, id int64) (*SecurityList, error) {
	// query
	const sqlstr = `SELECT ` +
		`id, file_title, downloaded_at, created_at, updated_at ` +
		`FROM public.security_lists ` +
		`WHERE id = $1`
	// run
	logf(sqlstr, id)
	sl := SecurityList{
		_exists: true,
	}
	if err := db.QueryRowContext(ctx, sqlstr, id).Scan(&sl.ID, &sl.FileTitle, &sl.DownloadedAt, &sl.CreatedAt, &sl.UpdatedAt); err != nil {
		return nil, logerror(err)
	}
	return &sl, nil
}
