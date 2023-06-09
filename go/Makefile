export

# Setup Variables for Go
GOPATH := $(shell go env GOPATH)
GOBIN := $(PWD)/bin

# Setup PATH
PATH := $(GOBIN):$(PATH)

.PHONY: install/tools
install/tools:
	@./scripts/install_go_tools.sh
