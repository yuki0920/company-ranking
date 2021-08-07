# company-ranking

## 起動

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
