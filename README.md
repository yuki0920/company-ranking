# company-ranking

JAPAN Listed Companies is a website that displays sales and annual salaries of companies listed on the Tokyo Stock Exchange in a ranking format. This website is available in English and Japanese

- English: https://www.company-ranking.net/en
- Japanese: https://www.company-ranking.net/ja

## Introduction Articles
- English: https://dev.to/yuki0920/from-personal-project-to-open-source-releasing-japan-listed-companies-site-41d3
- Japanese: https://zenn.dev/yuki0920/articles/ad5da7f23e2f6a

## Getting Started

### Setup

```sh
cp .env_sample .env
cp .envrc_sample .envrc
docker-compose build
docker-compose run --rm ruby bundle
docker-compose run --rm ruby bundle exec rails db:setup
docker-compose run --rm go make install/tools
cd typescript && npm install && cd ../
docker-compose up
```

## Architecture

![System Architecture Image](./architecture.drawio.svg)

### URL

Ports should be specified in `.env`.

- API(Rails): http://localhost:3003/markets
- Front(Next.js): http://localhost:8888
- Swagger UI: http://localhost:8000


### Run tests & lint

These commands are defined in Makefile.

https://github.com/yuki0920/company-ranking/blob/main/Makefile

## Update API

### Update OpenAPI Schema

The schema file is here.
https://github.com/yuki0920/company-ranking/blob/main/openapi/openapi.yaml

### Generate Code for server

```sh
# for server
make go/generate/server
```


### Generate Code for client

Install `openapi-generator-cli`

https://github.com/OpenAPITools/openapi-generator-cli#globally

```sh
make typescript/generate/client
```

## Data Processing flow(by Rails)

### 1. Get the security list by scraping.

```sh
bundle exec rake save_securities:all
```

How to check: If the companies listed on [the sheet](https://www.jpx.co.jp/listing/stocks/new/index.html) are registered, it is successful.
The data is created in DB(securities).

### 2. Get the metadata of security by EDINET API

The API is called `書類一覧API`
Endpoint: https://disclosure.edinet-fsa.go.jp/api/v1/documents.json

The API details are [here](https://disclosure2dl.edinet-fsa.go.jp/guide/static/disclosure/WZEK0110.html)

```sh
bundle exec rake save_document_summary:year
```

How to check: If the **metadata** such as `security_code` and `company_name` of the company's most recent announcement is reflected, it is successful.
The data is **created** in DB(documents).

### 3. Get the detail of security by EDINET API

The API is called `書類取得API`
Endpoint: https://disclosure.edinet-fsa.go.jp/api/v1/documents

```sh
bundle exec rake save_document_detail:batch
```

How to check: If the **details** such as `net_sales` and `average_annual_salary` of the company's most recent announcement are reflected, it is successful.
The data is **updated** in DB(documents).

## Contributions
We welcome your contributions.

Please read [Contribution Flow](CONTRIBUTING.md).

## Dependency Update

```sh
# common
docker compose build

# ruby
docker compose run --rm ruby bundle

# go
docker compose run --rm go go mod download

# typescript using local node_modules
cd typescript && npm ci
```
