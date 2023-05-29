export

# Setup Variables for Go
GOPATH := $(shell go env GOPATH)
GOBIN := $(PWD)/go/bin

# Setup PATH
PATH := $(GOBIN):$(PATH)

.PHONY: install/tools
install/tools:
	@echo "Installing tools..."
	@go install github.com/xo/xo@latest
