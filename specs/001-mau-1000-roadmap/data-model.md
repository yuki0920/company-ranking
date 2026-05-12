# Phase 1 Data Model: MAU 1000 達成ロードマップ

**Feature**: 001-mau-1000-roadmap
**Date**: 2026-05-11
**Source**: spec.md "Key Entities" + 既存 OpenAPI client 型(`typescript/client/**`、編集禁止)

このフィーチャーは新規 DB スキーマや新規 API を導入しない。本ドキュメントは「フロントエンドが取り回す概念モデル」として、既存 API レスポンスをどの ViewModel に詰め直すかを示す。

---

## 1. Company(企業)

**Source**: 生成済み client の `Company` 型 + `getCompany` レスポンス。

| Field | Type | 用途 |
|-------|------|------|
| `id` | `number` | 証券コード相当(URL の `[id]`)|
| `name` | `string` | H1、`<title>`、JSON-LD `Corporation.name`、OGP |
| `industryId` | `number` | 関連企業セクション、ハブのフィルタ |
| `marketId` | `number` | 関連企業セクション |
| `headOfficeLocation` | `string` | JSON-LD `Corporation.address` |
| `numberOfEmployees` | `number \| null` | JSON-LD `Corporation.numberOfEmployees`、OGP |
| `netSales` | `number \| null` | ランキング、関連企業セクション、ファクトイド |
| `lastYearNetSales` | `number \| null` | YoY 成長率(ファクトイド・ハブ コメンタリ) |
| `operatingIncome` | `number \| null` | 並び順タブ |
| `averageAnnualSalary` | `number \| null` | 並び順タブ・年収ランキングハブ |
| `equityToAssetRatio` | `number \| null` | 並び順タブ |
| `roe` | `number \| null` | ROE ランキングハブ |
| `fiscalYear` | `string`(例: `"FY2024"`)| データ更新日バッジ(FR-014a)|
| `dataUpdatedAt` | `Date` | データ更新日バッジ・sitemap `lastmod` |

**Validation / Edge cases**:
- `id` が DB に存在しない → `notFound()` を呼んで HTTP 404(FR-007b)
- 数値フィールドが `null`(未開示)の場合、ランキング・並び順タブ では除外する
- `dataUpdatedAt` が取れない場合はビルド日にフォールバック(コメント警告を出す)

**ViewModel**: `app/[lang]/companies/[id]/page.tsx` で `Company` を取得し、関連企業向けに `RelatedCompaniesViewModel`(industry TOP5 + market TOP5 ペア)に派生させる。

---

## 2. Industry(業界)

**Source**: 生成済み client の `Industry` 型 + `listIndustries`。

| Field | Type | 用途 |
|-------|------|------|
| `id` | `number` | URL の `[id]` |
| `nameJa` | `string` | 日本語ページの H1 / `<title>` / JSON-LD |
| `nameEn` | `string` | 英語ページの同上 |
| `companyCount` | `number`(派生)| ハブコメンタリ「{業界} 全 {N} 社中」 |

**Relationships**: `Industry` 1 — N `Company`(`Company.industryId` で参照)。

**State**: 33 業界で固定。spec の対象会計年度内では新規追加・削除はないと仮定する(EDINET 区分の異動は年に数件以下)。

---

## 3. Market(市場)

**Source**: 生成済み client の `Market` 型 + `listMarkets`。

| Field | Type | 用途 |
|-------|------|------|
| `id` | `number` | URL の `[id]` |
| `nameJa` / `nameEn` | `string` | H1 / `<title>` |
| `companyCount` | `number`(派生) | ハブコメンタリ |

**Relationships**: `Market` 1 — N `Company`(`Company.marketId` で参照)。

---

## 4. SortType(並び順)

**Source**: 新規(クライアント側のみで定義)。

```ts
// typescript/lib/sort-type.ts に定義予定
export const SORT_TYPES = ["net_sales", "salary", "op-income", "equity"] as const;
export type SortType = typeof SORT_TYPES[number];
```

| `slug` | データ列 | デフォルトか |
|--------|---------|-------------|
| `net_sales` | `Company.netSales` desc | ✅ デフォルト(URL では省略可) |
| `salary` | `Company.averageAnnualSalary` desc | |
| `op-income` | `Company.operatingIncome` desc | |
| `equity` | `Company.equityToAssetRatio` desc | |

**Validation**: 上記 4 値以外の slug が来た場合 `notFound()`。`generateStaticParams` で限定列挙する。

**`<title>` 表現**(`dictionaries/{lang}.json`):

```json
{ "sortType": { "salary": "平均年収", "op-income": "営業利益", "equity": "自己資本比率" } }
```

---

## 5. RankingHub(ランキングハブ)

**Source**: 新規(`typescript/lib/ranking-hubs.ts` の静的マップ)。

```ts
type RankingHubSlug = "nensyu" | "uriage" | "eigyou-rieki" | "roe" | string;

interface RankingHub {
  slug: RankingHubSlug;
  sortType: SortType;
  industryId?: number;        // クロス業界ハブの場合
  marketId?: number;
  titleJa: string;            // 例: "日本企業 平均年収ランキング 2026"
  introJa: string;            // 200–400 字の固定導入文
  topNCompanies: number;      // 既定 50
}
```

| 初期スラッグ(Phase 3 の 20–30) | sortType | フィルタ | 例タイトル |
|---|---|---|---|
| `nensyu` | salary | なし | 日本企業 平均年収ランキング |
| `uriage` | net_sales | なし | 売上高ランキング |
| `eigyou-rieki` | op-income | なし | 営業利益ランキング |
| `roe` | (custom: roe) | なし | ROE ランキング |
| `nensyu/jouhou-tsushin` | salary | industryId=情報通信 | 情報通信業 平均年収ランキング |
| `nensyu/ginkougyou` | salary | industryId=銀行 | 銀行業 平均年収ランキング |
| ...(主要 10 業界 × 2 指標) | | | |

Phase 4 で 80–100 まで拡張(FR-024)。

**Validation**: スラッグは静的マップに登録されたもの以外 `notFound()`。

---

## 6. SitemapEntry(sitemap.xml の 1 行)

**Source**: 新規(`typescript/lib/sitemap-data.ts`)。Next.js の `MetadataRoute.Sitemap` 型に詰める。

```ts
interface SitemapEntry {
  url: string;                                // 絶対 URL
  lastModified: Date;                         // Company は dataUpdatedAt、それ以外はビルド日
  changeFrequency: "monthly" | "weekly" | "yearly";
  priority: number;                           // 0.1–1.0
  alternates: { languages: { ja: string; en: string } };
}
```

**生成ルール**(詳細は `contracts/sitemap-shape.md` 参照):

| 種類 | URL パターン | priority | changeFrequency |
|------|-------------|----------|-----------------|
| トップ | `/{lang}` | 1.0 | weekly |
| 企業リスト | `/{lang}/companies` | 0.8 | weekly |
| 企業詳細 | `/{lang}/companies/{id}` | 0.6 | monthly |
| 業界詳細(default) | `/{lang}/industries/{id}` | 0.7 | weekly |
| 業界 sortType タブ | `/{lang}/industries/{id}/{sortType}` | 0.6 | weekly |
| 業界 overview(Phase 4) | `/{lang}/industries/{id}/overview` | 0.7 | monthly |
| 市場詳細 | `/{lang}/markets/{id}` | 0.7 | weekly |
| 市場 sortType | `/{lang}/markets/{id}/{sortType}` | 0.6 | weekly |
| ランキングハブ | `/{lang}/rankings/{slug}` | 0.7 | weekly |
| 比較ページ(prebuilt) | `/{lang}/compare/{idA}/{idB}` | 0.4 | monthly |
| 静的(contact / terms_of_use) | `/{lang}/contact` 他 | 0.3 | yearly |

---

## 7. DataFreshness(データ更新日バッジ)

**Source**: `Company.fiscalYear` + `Company.dataUpdatedAt` の組。Industry/Market ページではそれぞれの所属 Company 群の `MAX(dataUpdatedAt)` を集約値として使う。

```ts
interface DataFreshness {
  fiscalYear: string;     // "FY2024" など
  updatedAt: Date;        // 表示は YYYY-MM-DD
}
```

**配置**: H1 直下またはサイドバー先頭(FR-014a)。`<DataFreshnessBadge fiscalYear updatedAt />` 1 コンポーネントで全ページ統一。

---

## 8. Factoid(「今日の発見」)

**Source**: 新規(`typescript/lib/factoids.ts`)。トップページ・各ハブで使い回せるようテンプレ関数として実装。

```ts
type Factoid =
  | { kind: "max", metric: string, company: string, value: number, unit: string }
  | { kind: "yoyTopGrower", company: string, growthPct: number }
  | { kind: "industryShare", industry: string, top5SharePct: number };
```

ビルド時に決定論的に算出する(同日内は同じファクトイドが出る)。

---

## 9. URL canonical / hreflang(派生規則)

エンティティではなく算出ルール。`typescript/lib/seo.ts` 内に集約:

```ts
function canonicalFor(path: string, lang: "ja" | "en"): URL;
function hreflangAlternates(path: string): {
  "ja-JP": string;
  "en-US": string;
  "x-default": string; // = ja
};
```

- `x-default` は `ja` を指す(主要ターゲットが日本語のため)
- 並び順タブのデフォルト(`net_sales`)は canonical を `/{lang}/industries/{id}` に統一

---

## 10. データ取得経路(まとめ)

| ページ | 必要データ | 取得関数(既存) | レンダリング戦略 |
|--------|-----------|------------------|-----------------|
| `/{lang}` | 企業 TOP10、業界・市場一覧、ファクトイド | `listCompanies({ limit: 10 })` + `listIndustries` + `listMarkets` | SSG + `revalidate=3600` |
| `/{lang}/companies` | 企業一覧 + ページング | `listCompanies` | ISR `revalidate=3600` |
| `/{lang}/companies/[id]` | 企業詳細 + 関連企業 | `getCompany` + `listCompanies({ industryId })` + `listCompanies({ marketId })` | SSG(`generateStaticParams`)|
| `/{lang}/industries/[id]` | 業界詳細 + 上位企業 | `listIndustries` + `listCompanies({ industryId })` | ISR `revalidate=3600` |
| `/{lang}/industries/[id]/[sortType]` | 同上 + 並び順 | 同上 | ISR `revalidate=3600` |
| `/{lang}/rankings/[slug]` | ハブ静的設定 + 上位企業 | `listCompanies` フィルタ済 | SSG + `revalidate=86400` |
| `/{lang}/compare/[idA]/[idB]` | 2 社の詳細 | `getCompany` × 2 | 上位 200 ペア SSG + `dynamicParams` |
| `app/sitemap.ts` | 全 ID 列挙 | `listSecurityCodes` + `listIndustries` + `listMarkets` | `revalidate=86400` |

すべての取得は **生成済み client 経由**。`typescript/client/**` には触れない(Constitution III)。新規エンドポイントは追加しない(Constitution I)。
