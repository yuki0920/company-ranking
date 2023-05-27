# company-ranking

## 起動

### はじめに

```
cp .env_sample .env
docker-compose build
docker-compose run --rm api bundle
docker-compose run --rm api bundle exec rails db setup
docker-compose run --rm front yarn
docker-compose up
```

### API

- コンテナのポートは`3000`
- ホストのコンテナは`3003`など`3000`以外を使用している

### Front

- ホストのコンテナは`8008`を使用している

### Swagger

- ホストのコンテナは`8000`を使用している


### OpenAPI Generator

実行後にLintをかける

```
docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli generate \
  -i local/api/openapi/openapi.yaml \
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

## DB(for Development)

### DB情報出力
```sh
# rails console
Rails.configuration.database_configuration["development"]
# {"adapter"=>"postgresql", "encoding"=>"unicode", "pool"=>5, "host"=>"db", "username"=>"postgres", "password"=>"password", "database"=>"myapp_development"}
```

### DB接続
```sh
docker-compose ps | grep postgres
company-ranking-db-1        postgres:12.7-alpine    "docker-entrypoint.s…"   db                  13 minutes ago      Up 13 minutes       0.0.0.0:5432->5432/tcp

psql -h 0.0.0.0 -p 5432 -U postgres myapp_development
# or
psql "postgresql://0.0.0.0:5432/myapp_development?user=postgres&password=password&sslmode=disable"
```

### xo
```sh
xo schema "postgresql://0.0.0.0:5432/myapp_development?user=postgres&password=password&sslmode=disable" -o api-go/model
```
