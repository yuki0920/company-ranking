#!/bin/bash

set -eu

echo "Creating database..."
usql "$DATABASE_HOST_URL" \
  --set=POSTGRES_NAME="$POSTGRES_TEST_NAME" \
  --set=POSTGRES_USER="$POSTGRES_TEST_USER" \
  --set=POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \
  -f db/init.sql

echo "Loading schema..."
usql "$DATABASE_TEST_URL" \
  -f db/schema.sql

echo "Loading seed data..."
usql "$DATABASE_TEST_URL" \
  -f db/seed.sql
