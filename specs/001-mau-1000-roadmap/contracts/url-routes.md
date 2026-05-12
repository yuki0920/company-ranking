# Contract: URL Routes

**Feature**: 001-mau-1000-roadmap
**Purpose**: 公開 URL の規約と canonical / hreflang 算出ルールを固定する。Phase 1 設計の入力であり、実装後の差分検証にも使う。

---

## 1. ルート一覧

凡例: `[lang]` ∈ `{ja, en}`、`[id]` は数値、`[slug]` / `[sortType]` は別表参照。

| 種類 | パターン | レンダリング | sitemap | canonical 規則 |
|------|----------|-------------|---------|----------------|
| ルート(JA 既定リダイレクト) | `/` | redirect → `/ja` | 含めない | n/a |
| トップ | `/[lang]` | SSG + ISR(1h) | ✅ | self |
| 企業リスト | `/[lang]/companies` | ISR(1h) | ✅ | self(クエリ無視) |
| 企業詳細 | `/[lang]/companies/[id]` | SSG | ✅(現存 ID のみ) | self |
| 業界詳細(default sort) | `/[lang]/industries/[id]` | ISR(1h) | ✅ | self |
| 業界 sortType タブ | `/[lang]/industries/[id]/[sortType]` | ISR(1h) | ✅ | `[sortType]==net_sales` のときは `/[lang]/industries/[id]` を canonical |
| 業界 overview(P4) | `/[lang]/industries/[id]/overview` | ISR(24h) | ✅ | self |
| 市場詳細 | `/[lang]/markets/[id]` | ISR(1h) | ✅ | self |
| 市場 sortType | `/[lang]/markets/[id]/[sortType]` | ISR(1h) | ✅ | 上記同様 |
| ランキングハブ | `/[lang]/rankings/[slug]` | SSG + ISR(24h) | ✅ | self |
| 比較ページ | `/[lang]/compare/[idA]/[idB]` | 上位 200 ペア SSG / 残り on-demand ISR | ✅(prebuilt 分のみ) | self(`idA < idB` に正規化) |
| お問い合わせ / 利用規約 | `/[lang]/contact`, `/[lang]/terms_of_use` | SSG | ✅ | self |
| sitemap | `/sitemap.xml` | 動的(`app/sitemap.ts`、24h revalidate) | n/a | n/a |
| robots | `/robots.txt` | 静的(`app/robots.ts`) | n/a | n/a |
| OGP 動的画像 | `/[lang]/.../opengraph-image` | Edge Runtime(オンデマンド + CDN) | 含めない | n/a |

## 2. 並び順 sortType の語彙

| URL slug | データ列 | デフォルト |
|----------|---------|-----------|
| (未指定) | `Company.netSales` desc | ✅ |
| `salary` | `Company.averageAnnualSalary` desc | |
| `op-income` | `Company.operatingIncome` desc | |
| `equity` | `Company.equityToAssetRatio` desc | |

`generateStaticParams` で上記 4 種に限定列挙。それ以外は `notFound()`。

## 3. ランキングハブ slug の語彙(Phase 3 初期)

| slug | sortType | filter | 想定タイトル(JA) |
|------|----------|--------|------------------|
| `nensyu` | salary | - | 日本企業 平均年収ランキング |
| `uriage` | net_sales | - | 売上高ランキング |
| `eigyou-rieki` | op-income | - | 営業利益ランキング |
| `roe` | (custom: ROE 列) | - | ROE ランキング |
| `nensyu/{industry-slug}` | salary | industryId | {業界名} 平均年収ランキング |
| `uriage/{industry-slug}` | net_sales | industryId | {業界名} 売上高ランキング |

`industry-slug` は `dictionaries/{lang}.json` の `industrySlug` テーブルで管理(例: 銀行業 → `ginkougyou`)。

## 4. canonical 算出

```
canonical(path, lang) := https://www.company-ranking.net{path}
```

- 末尾 `/` はつけない
- `?` 以降は除外(クエリストリングをカノニカルに含めない)
- sortType デフォルト(`net_sales`)はパスから sortType セグメントを除いた URL を canonical
- 比較ページは `idA < idB` の順序に正規化した URL を canonical

## 5. hreflang 算出

```
hreflang(path) := {
  "ja-JP":     https://www.company-ranking.net/ja{relativePath}
  "en-US":     https://www.company-ranking.net/en{relativePath}
  "x-default": (= ja-JP のもの)
}
```

`relativePath` はパスから `/[lang]` プレフィクスを除いたもの。

英語版コンテンツが存在しないハブ・比較・overview ページは:

- 該当英語パスが 404 を返すならば `<link rel="alternate" hreflang="en-US">` を **出力しない**(Google の hreflang クラスタ無効化を防ぐ)
- それ以外は両方を出力

## 6. og:locale

| `[lang]` | `og:locale` |
|----------|-------------|
| `ja` | `ja_JP` |
| `en` | `en_US` |

`app/[lang]/layout.tsx` で動的に切替(現状のハードコード `ja_JP` は FR-003 に違反)。

## 7. robots.txt の設計

```
User-agent: *
Allow: /
Disallow: /*?q=*
Disallow: /*?sortType=*

Sitemap: https://www.company-ranking.net/sitemap.xml
```

**注意**: `?sortType=*` Disallow があるため、並び順タブは **path segment** で実装する(クエリパラメータ不採用)。`/*opengraph-image*` は Allow のままでよい(Google にとって有用)。

## 8. 削除済み URL の扱い

- 企業 ID が存在しない: `notFound()` → HTTP 404、`<head>` に `<meta name="robots" content="noindex">`、sitemap からも除外
- 不正な sortType / hub slug: `generateStaticParams` で限定済み + `notFound()`
- リダイレクトが必要なケース(例: 旧 URL → 新 URL): 現時点では発生しない設計。将来必要なら `next.config.mjs` の `redirects()` を使う(別チケット)

## 9. このコントラクトの検証方法

`quickstart.md` の Phase 1 検証セクションで以下を確認する:

1. `curl https://www.company-ranking.net/sitemap.xml` で URL が表に従って列挙されること
2. `curl -I /ja/companies/{存在しないID}` が **HTTP 404** を返すこと(soft-404 でないこと)
3. `curl /ja/industries/{id}` のレスポンス HTML に `<link rel="canonical" href="https://www.company-ranking.net/ja/industries/{id}">` と `<link rel="alternate" hreflang="ja-JP" ...>` が含まれること
4. `curl /ja/industries/{id}/salary` の HTML の canonical が `/ja/industries/{id}/salary` を指していること(non-default のため self が canonical)
