# company-ranking

## 起動

### Getting Started

1. Setup DB & Front server using Docker
```
cp .env_sample .env
cp .envrc_sample .envrc
docker-compose build
docker-compose run --rm ruby bundle
docker-compose run --rm ruby bundle exec rails db setup
docker-compose run --rm front yarn
docker-compose up
```

2. Setup API server using local Go

```
cd ./go
go mod download
go run cmd/server/main.go
```

### API

- コンテナのポートは`3000`
- ホストのコンテナは`3003`など`3000`以外を使用している

http://localhost:3003/api/v1/markets

### Front

- ホストのコンテナは`8008`を使用している

http://localhost:8008
### Swagger

- ホストのコンテナは`8000`を使用している

http://localhost:8000

### OpenAPI Generator

実行後にLintをかける

```
docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli generate \
  -i local/ruby/openapi/openapi.yaml \
  -g typescript-angular \
  -o local/front/types/typescript-angular
dc run --rm front yarn lint --fix
```

## Dependabotによるライブラリアップデートの注意点

### loader系は固定

```bash
"css-loader": "^5.2.0"
"sass-loader": "10"
```

ref: [設定 プリプロセッサ - NuxtJS](https://ja.nuxtjs.org/docs/2.x/features/configuration)

### 1つのPRにまとめる

ビルドに時間がかかるので1つのPRにまとめた上でマージすることで、ビルド時間を短縮する

## 企業情報登録フロー

rake taskで実行している

### 1. 証券コードから企業登録

```
bundle exec rake save_securities:every_2weeks
```

確認方法: https://www.jpx.co.jp/listing/stocks/new/index.html に掲載されている企業が登録されていればOK

### 2. EDINET APIから概要を取得

```
bundle exec rake save_document_summary:year
```

確認方法: 最新の決算発表をした企業の**概要**が反映されていればOK

### 3. EDINET APIから有報をダウンロードし解析

```
bundle exec rake save_document_detail:batch
```

確認方法: 最新の決算発表をした企業の**詳細**が反映されていればOK
