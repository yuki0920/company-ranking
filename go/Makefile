export

# Setup Variables for Go
GOPATH := $(shell go env GOPATH)

# Setup PATH
PATH := $(GOBIN):$(PATH)

.PHONY: install/tools
install/tools:
	@./scripts/install_go_tools.sh

.PHONY: generate/models
generate/models:
	@xo schema ${DATABASE_URL} -o models
	@find models -type f -name "*.go" | xargs sed -i 's/Timestamp6WithoutTimeZone/time.Time/g'
	@find models -type f -name "*.go" | xargs sed -i '/import (/a \\t"time"'
	@find models -type f -name "*.go" | xargs goimports -w
	@find models -type f -name "*.go" | xargs gofmt -s -w
	rm -f models/arinternalmetadatum.xo.go models/schemamigration.xo.go

.PHONY: generate/schema
generate/schema:
	@xo schema ${DATABASE_URL} -t createdb -o db/sql -S schema.sql

.PHONY: generate/server
generate/server:
	@oapi-codegen -config server/config.yaml openapi.yaml

.PHONY: test
test:
	@./scripts/setup_db.sh
	@go test -v -race -shuffle=on ./... -coverprofile=coverage.out

.PHONY: lint
lint:
	@golangci-lint run ./...

.PHONY: lint/fix
lint/fix:
	@golangci-lint run ./... --fix
