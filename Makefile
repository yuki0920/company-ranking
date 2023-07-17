.PHONY: go/install/tools
go/install/tools:
	@docker compose run --rm go make install/tools

.PHONY: go/generate/models
go/generate/models:
	@docker compose run --rm go make generate/models

.PHONY: go/generate/server
go/generate/server:
	@cp openapi/openapi.yaml go/openapi.yaml
	@docker compose run --rm go make generate/server
	@rm -f go/openapi.yaml

.PHONY: go/test
go/test:
	@docker compose run --rm go make test

.PHONY: go/lint
go/lint:
	@docker compose run --rm go make lint

.PHONY: go/lint/fix
go/lint/fix:
	@docker compose run --rm go make lint/fix

.PHONY: typescript/generate/client
typescript/generate/client:
	@cp openapi/openapi.yaml typescript/openapi.yaml
	@cd typescript && npm run generate-client
	@cd ..
	@rm -f typescript/openapi.yaml

.PHONY: typescript/lint
typescript/lint:
	@docker compose run --rm typescript npm run lint

.PHONY: typescript/lint/fix
typescript/lint/fix:
	@docker compose run --rm typescript npm run lint --fix

.PHONY: typescript/format
typescript/format:
	@docker compose run --rm typescript npm run format

.PHONY: ruby/test
ruby/test:
	@docker compose run --rm ruby bundle exec rspec

.PHONY: ruby/lint
ruby/lint:
	@docker compose run --rm ruby bundle exec rubocop

.PHONY: ruby/lint/fix
ruby/lint/fix:
	@docker compose run --rm ruby bundle exec rubocop --fix
