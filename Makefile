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

.PHONY: install/tools
install/tools:
	@echo "Installing tools..."
	@go install github.com/xo/xo@latest

.PHONY: generate/models
generate/models:
	@xo schema "postgresql://${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_NAME}?user=${POSTGRES_USER}&password=${POSTGRES_PASSWORD}&sslmode=disable" -o go/models -e "*.created_at" -e "*.updated_at"
	rm -rf go/models/arinternalmetadatum.xo.go go/models/schemamigration.xo.go
