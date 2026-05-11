# Contract: sitemap.xml の形

**Feature**: 001-mau-1000-roadmap
**Purpose**: `app/sitemap.ts` が返す `MetadataRoute.Sitemap` 配列の各エントリの値の決定ルールを固定する。

---

## 1. ファイル位置

- 単一ファイル: `typescript/app/sitemap.ts`
- 公開 URL: `https://www.company-ranking.net/sitemap.xml`
- `export const revalidate = 86400`(24 時間で再生成)

URL 数が 10,000 を超えた段階で `generateSitemaps` API を使い `sitemap-{group}.xml` 形式に分割(FR-026)。分割閾値到達は Phase 3 後半の見込み。

---

## 2. エントリ型

Next.js 標準型をそのまま使う:

```ts
// from next/dist/lib/metadata/types/metadata-interface
type SitemapEntry = {
  url: string;                              // 絶対 URL、末尾スラッシュなし
  lastModified?: string | Date;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;                        // 0.0 – 1.0
  alternates?: {
    languages?: Record<string, string>;     // BCP47 言語コード → URL
  };
};
```

`alternates.languages` のキーは `ja`(or `ja-JP`)と `en`(or `en-US`)を採用。Google は どちらでも解釈する。

---

## 3. URL 種類ごとの値

`BASE = https://www.company-ranking.net`

### 3.1 静的ページ

| `url` | `lastModified` | `changeFrequency` | `priority` | `alternates.languages` |
|-------|----------------|--------------------|-----------|----------------------|
| `BASE/ja` | (ビルド日) | `weekly` | `1.0` | `{ ja: BASE/ja, en: BASE/en }` |
| `BASE/en` | 同上 | 同上 | 同上 | 同上 |
| `BASE/ja/companies` | (ビルド日) | `weekly` | `0.8` | `{ ja: BASE/ja/companies, en: BASE/en/companies }` |
| `BASE/en/companies` | 同上 | 同上 | 同上 | 同上 |
| `BASE/ja/contact` | (ビルド日) | `yearly` | `0.3` | 両方 |
| `BASE/en/contact` | 同上 | 同上 | 同上 | 両方 |
| `BASE/ja/terms_of_use` | (ビルド日) | `yearly` | `0.3` | 両方 |
| `BASE/en/terms_of_use` | 同上 | 同上 | 同上 | 両方 |

### 3.2 企業詳細(動的)

```
url:                BASE/[lang]/companies/[id]
lastModified:       Company.dataUpdatedAt(なければビルド日)
changeFrequency:    "monthly"
priority:           0.6
alternates.languages: { ja: BASE/ja/companies/[id], en: BASE/en/companies/[id] }
```

- 取得元: `listSecurityCodes()` を 1 回呼んで全企業 ID を取得 → ロケール 2 倍展開
- **soft-404 防止**(FR-007b): `listSecurityCodes` が返さない ID は含めない

### 3.3 業界詳細 + 並び順タブ

```
# デフォルト(net_sales)
url:                BASE/[lang]/industries/[id]
lastModified:       (ビルド日)
changeFrequency:    "weekly"
priority:           0.7

# 並び順タブ 3 種(salary / op-income / equity)
url:                BASE/[lang]/industries/[id]/[sortType]
lastModified:       (ビルド日)
changeFrequency:    "weekly"
priority:           0.6
```

各エントリに `alternates.languages` を付与。

### 3.4 市場詳細 + 並び順タブ

業界と同じ形式。

### 3.5 業界 overview(Phase 4)

```
url:                BASE/[lang]/industries/[id]/overview
lastModified:       (ビルド日)
changeFrequency:    "monthly"
priority:           0.7
```

### 3.6 ランキングハブ

```
url:                BASE/[lang]/rankings/[slug]
lastModified:       (ビルド日)
changeFrequency:    "weekly"
priority:           0.7
alternates.languages: 英語版が未提供のものは ja のみ(出さない方が hreflang クラスタの誤検出を防げる)
```

### 3.7 比較ページ(prebuilt のみ)

```
url:                BASE/[lang]/compare/[idA]/[idB]
lastModified:       (ビルド日)
changeFrequency:    "monthly"
priority:           0.4
```

- 上位 200 ペア(`generateStaticParams` 範囲)のみ sitemap に含める
- on-demand ISR の動的生成ペアは sitemap には載せない(クロール優先度を上げる必要がないため)

---

## 4. 出力規模見積もり

| カテゴリ | エントリ数 |
|----------|-----------|
| 静的 | 8 |
| 企業詳細 × 2 ロケール | ~6,000 |
| 業界(default + 3 sort) × 33 業界 × 2 ロケール | 264 |
| 市場(default + 3 sort) × 主要市場 ~10 × 2 ロケール | 80 |
| 業界 overview × 33 × 2 ロケール | 66(Phase 4) |
| ランキングハブ JA | 20–30(P3) → 80–100(P4) |
| ランキングハブ EN | 0(未提供) |
| 比較 × 2 ロケール | 400 |
| **合計** | **~7,000 → ~7,200 → ~7,300** |

50,000 URL 上限の単一 sitemap で十分。10,000 を超えるのは P4 完了後の拡張時。

---

## 5. キャッシュ / 鮮度

- `revalidate = 86400` で日次再生成
- 企業データ更新(Ruby バッチ実行)後の sitemap 鮮度遅延は最大 24h
- GSC への手動再提出は不要(URL 自体に変化はなく、`lastmod` が変わる程度)

---

## 6. 検証

`quickstart.md` の Phase 1 セクションで以下を確認:

```bash
# 1. sitemap が 200 OK で返る
curl -I https://www.company-ranking.net/sitemap.xml

# 2. エントリ数が想定通り(~7,000)
curl -s https://www.company-ranking.net/sitemap.xml | grep -c "<loc>"

# 3. hreflang alternates が含まれている
curl -s https://www.company-ranking.net/sitemap.xml | grep -c "xhtml:link"

# 4. ローカルビルドで生成できる
docker compose run --rm typescript npm run build && \
  ls typescript/.next/server/app/sitemap.xml
```
