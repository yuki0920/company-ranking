# How to update test db

schema.sql is used to update test db

## Prerequisites
- Prod DB: Maintained by rails
- Test DB: Maintained by supabase cli

## Dump shema in production

```
supabase login
supabase db dump -f supabase/production_schema.sql --db-url <PRODUCTION_DB_URL>
```

## Update production shema to test db
```
supabase link --project-ref company-ranking-test
supabase db diff -f apply_production_schema
supabase db push
```
