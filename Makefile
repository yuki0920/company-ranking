export

# Setup Environment Variables
POSTGRES_HOST := 0.0.0.0
POSTGRES_PORT := 5432
POSTGRES_NAME := myapp_development
POSTGRES_USER := postgres
POSTGRES_PASSWORD := password
DATABASE_URL := "postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_NAME}?sslmode=disable"

.PHONY: generate/models
generate/models:
	@xo schema ${DATABASE_URL} -o go/models -e "*.created_at" -e "*.updated_at"
	rm -f go/models/arinternalmetadatum.xo.go go/models/schemamigration.xo.go

.PHONY: generate/server
generate/server:
	@oapi-codegen -config go/server/config.yaml -o go/server/server.gen.go openapi/openapi.yaml

.PHONY: lint
lint:
	@echo "Linting..."
	@cd go && golangci-lint run ./...
	@cd ..

.PHONY: lint/fix
lint/fix:
	@echo "Linting..."
	@cd go && golangci-lint run ./... --fix
	@cd ..

.PHONY: generate/client
generate/client:
	@openapi-generator-cli generate -i openapi/openapi.yaml -g typescript-fetch -o typescript/client

.PHONY: typescript/lint
typescript/lint:
	@docker compose run --rm typescript npm run lint

.PHONY: typescript/lint/fix
typescript/lint/fix:
	@docker compose run --rm typescript npm run lint --fix
