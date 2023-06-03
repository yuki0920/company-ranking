export

# Setup Variables for Go
GOPATH := $(shell go env GOPATH)
GOBIN := $(PWD)/go/bin

# Setup PATH
PATH := $(GOBIN):$(PATH)

# Setup Environment Variables
POSTGRES_HOST := 0.0.0.0
POSTGRES_PORT := 5432
POSTGRES_NAME := myapp_development
POSTGRES_USER := postgres
POSTGRES_PASSWORD := password
DATABASE_URL := "postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_NAME}?sslmode=disable"

.PHONY: install/tools
install/tools:
	@echo "Installing tools..."
	@go install github.com/xo/xo@latest
	@go install github.com/deepmap/oapi-codegen/cmd/oapi-codegen@latest

.PHONY: generate/models
generate/models:
	@xo schema ${DATABASE_URL} -o go/models -e "*.created_at" -e "*.updated_at"
	rm -f go/models/arinternalmetadatum.xo.go go/models/schemamigration.xo.go

.PHONY: generate/server
generate/server:
	@oapi-codegen -config go/server/config.yaml -o go/server/server.gen.go openapi/openapi.yaml
