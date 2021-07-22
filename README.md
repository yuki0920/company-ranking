# company-ranking

## 起動

### API

- コンテナのポートは`3000`
- ホストのコンテナは`3003`など`3000`以外を使用している

### Front

- ホストのコンテナは`8008`を使用している

### Swagger

- ホストのコンテナは`8000`を使用している

### StoryBook

run コマンド実行時はportのマッピングがされないため、指定する

```bash
dc run -p 6006:6006 front yarn storybook
```
