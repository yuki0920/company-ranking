export

# Setup Variables for Go
GOPATH := $(shell go env GOPATH)
GOBIN := /bin

# Setup PATH
PATH := $(GOBIN):$(PATH)

.PHONY: install/tools
install/tools:
	@./scripts/install_go_tools.sh

.PHONY: generate/models
generate/models:
	@xo schema ${DATABASE_URL} -o models -e "*.created_at" -e "*.updated_at"
	rm -f models/arinternalmetadatum.xo.go models/schemamigration.xo.go

.PHONY: generate/server
generate/server:
	@oapi-codegen -config server/config.yaml -o server/server.gen.go openapi.yaml

.PHONY: lint
lint:
	@golangci-lint run ./...

.PHONY: lint/fix
lint/fix:
	@golangci-lint run ./... --fix
