# Repository Guidelines

## Project Structure & Module Organization
- go/: Go API server. Generated code lives under `go/server`; tests in `go/server/*_test.go`.
- ruby/: Rails app for data processing and scraping tasks. Tests in `ruby/spec`.
- typescript/: Next.js frontend (App Router). UI in `typescript/app` and `typescript/components`.
- openapi/: API schema (`openapi.yaml`). Used to generate server/client code.
- compose.yaml: Docker Compose services for db, go, ruby, typescript, swagger.
- misc: `terraform/` and `supabase/` hold infra/config; see directories as needed.

## Build, Test, and Development Commands
- Bootstrap: `cp .env_sample .env && cp .envrc_sample .envrc && docker compose build`
- Run stack: `docker compose up` (Next.js on `$FRONT_HOST_PORT`, API on `$API_HOST_PORT`).
- Go: `make go/install/tools`, `make go/test`, `make go/lint`, `make go/lint/fix`.
- Ruby: `make ruby/test`, `make ruby/lint`, `make ruby/lint/fix`.
- TypeScript: `make typescript/lint`, `make typescript/format`.
- OpenAPI codegen: `make go/generate/server` and `make typescript/generate/client`.

## Coding Style & Naming Conventions
- Go: formatted by `gofmt`/`goimports`; lint via `golangci-lint`. Package/file names `lower_snake`, exported types `CamelCase`.
- Ruby: 2-space indent, snake_case for files/methods; lint with RuboCop.
- TypeScript: ESLint + Prettier (2 spaces). Components `PascalCase` (e.g., `components/Header.tsx`), route folders lowercase.

## Testing Guidelines
- Go: `make go/test` runs `go test -race -shuffle` with coverage to `go/coverage.out`.
- Ruby: `make ruby/test` runs RSpec. Ensure DB is migrated/seeded as needed (`docker compose run --rm ruby bundle exec rails db:setup`).
- TypeScript: No unit tests yet; ensure `npm run build` succeeds and run `make typescript/lint`.

## Commit & Pull Request Guidelines
- Commits: short, imperative subject lines (optionally scoped), e.g., `go: fix pagination meta`, `typescript: update Header`.
- Branches: `feature/<brief>`, `fix/<brief>`, or `chore/<brief>`.
- PRs: include a clear description, linked issues (`Closes #123`), and screenshots/gifs for UI changes. Ensure CI is green and run `make go/lint` + `make typescript/lint` + `make ruby/lint` locally.

## Security & Configuration Tips
- Never commit secrets. Copy `.env_sample` → `.env`; use `.envrc` with direnv if desired.
- Key vars: `NEXT_PUBLIC_API_URL`, `POSTGRES_*`, `EDINET_API_KEY`. Ports are set in `.env` and referenced by `compose.yaml`.
- After changing `openapi/openapi.yaml`, regenerate server/client and re-run linters.

