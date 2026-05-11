# Implementation Plan: MAU 1000 達成ロードマップ

**Branch**: `001-mau-1000-roadmap` | **Date**: 2026-05-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-mau-1000-roadmap/spec.md`

## Summary

Next.js 15 App Router フロントエンド (`typescript/`) に SEO 基盤(sitemap / robots / hreflang / canonical / 構造化データ / OGP)とコンテンツ拡充(関連企業セクション、並び順 path tabs、ランキングハブ、比較ページ、業界 overview)を加え、データ更新日表示・soft-404 防止・Core Web Vitals 維持を組み合わせて、3 ヶ月で実 MAU 約 100 → 1,000 を達成する。Go API・Ruby バッチ・OpenAPI 契約・PostgreSQL スキーマには変更を加えない(フロントエンド単独機能)。

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20.x。Next.js 15 App Router(`typescript/`)
**Primary Dependencies**: Next.js 15(Metadata API、`next/og` の `ImageResponse`、`MetadataRoute.Sitemap` / `Robots`)、React 19 RSC、生成済み TS API クライアント(`typescript/client/**`、編集禁止)、`@/hooks/GetData.ts`(既存ラッパ)、`@/hooks/GetDictionary.ts`(i18n)
**Storage**: 既存 PostgreSQL を Go API 経由で読み取り(フロントエンドからは `NEXT_PUBLIC_API_URL` 越しに HTTP)。スキーマ変更なし
**Testing**: TypeScript には自動ユニットテストなし(Constitution IV)。検証手段: `make typescript/lint` + `docker compose run --rm typescript npm run build` + 手動ブラウザ確認(主要ページのリストを PR 本文に明記)
**Target Platform**: 本番 Vercel(Edge + Serverless)。ローカル開発は `docker compose up`
**Project Type**: web frontend(monorepo の `typescript/` のみ)
**Performance Goals**: Lighthouse SEO ≥ 95、Lighthouse Performance(mobile)≥ 80、LCP ≤ 2.5s、INP ≤ 200ms、CLS ≤ 0.1。実 MAU(GA4 engagement filter 適用)1,000 / 28 日
**Constraints**: 新規外部サービス導入なし(Constitution V)。OpenAPI 変更なし(API 既存エンドポイントで完結)。生成コード(`typescript/client/**`)編集禁止(Constitution III)。1 人 × 約 15h/週の運用工数
**Scale/Scope**: 初期 ~6,000 URL(約 3,000 企業 × 2 ロケール + 33 業界 + 市場 × 2 ロケール + 静的)。Phase 2 で並び順 path tab を 4 種展開 → ~25,000 URL 級。Phase 3-4 で 20–100 ランキングハブ + 上位 200 比較ペア + 業界 overview。最終的に 10,000 URL を超えた段階で sitemap index 化(FR-026)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Evaluation | Status |
|-----------|------------|--------|
| I. OpenAPI Contract Is the Source of Truth | 既存エンドポイント(`listSecurityCodes` / `listCompanies` / `listIndustries` / `listMarkets` / `getCompany`)のみで完結。スキーマ変更なし。 | ✅ Pass |
| II. Runtime Boundaries Are Fixed | 全変更は `typescript/` 配下。Ruby に HTTP 追加なし、Go にバッチ追加なし。 | ✅ Pass |
| III. Generated Code Is Read-Only | `typescript/client/**` 編集なし。新規ラッパは `typescript/components/` `typescript/hooks/` `typescript/app/` のみ。 | ✅ Pass |
| IV. Lint, Test, and Build Gates Per Touched Runtime | `make typescript/lint` + `npm run build` をマージ前提。PR 本文に手動確認したページを必ず列挙。 | ✅ Pass(運用ルールで担保) |
| V. External Service Boundaries Are Explicit | 新規 3rd-party 導入なし。GA4 / GSC / Hatenablog / Qiita / X はすべて既存または読み取り専用観測手段。`next/og` の `ImageResponse` は Next.js 標準機能で外部サービスではない。 | ✅ Pass |

**Initial gate**: 5/5 Pass、ブロッカーなし。Phase 1 設計後に再評価する(末尾 "Post-design Re-check" 参照)。

## Project Structure

### Documentation (this feature)

```text
specs/001-mau-1000-roadmap/
├── spec.md                              # /speckit-specify output
├── plan.md                              # This file (/speckit-plan output)
├── research.md                          # Phase 0 output
├── data-model.md                        # Phase 1 output
├── quickstart.md                        # Phase 1 output(運用 / 検証手順)
├── contracts/
│   ├── url-routes.md                    # Phase 1: URL routing & path conventions
│   └── sitemap-shape.md                 # Phase 1: sitemap.xml entry shape
├── checklists/
│   └── requirements.md                  # /speckit-specify quality checklist
└── tasks.md                             # /speckit-tasks 出力(本コマンドでは未生成)
```

### Source Code (repository root)

このフィーチャーは `typescript/` 配下のみ変更する。Go / Ruby / OpenAPI には触れない。

```text
typescript/
├── app/
│   ├── sitemap.ts                       # ★新規: MetadataRoute.Sitemap、~25k URL を返す
│   ├── robots.ts                        # ★新規: MetadataRoute.Robots
│   └── [lang]/
│       ├── layout.tsx                   # ✏修正: og:locale 動的化、hreflang、JSON-LD Organization+WebSite
│       ├── page.tsx                     # ✏修正: TOP10 ミニテーブル + ファクトイド + ハブティーザー
│       ├── companies/
│       │   ├── page.tsx                 # ✏修正: canonical+hreflang、ISR
│       │   └── [id]/
│       │       ├── page.tsx             # ✏修正: canonical+hreflang、JSON-LD、関連企業セクション、データ更新日、404 化
│       │       └── opengraph-image.tsx  # ★新規: 動的 OGP
│       ├── industries/
│       │   └── [id]/
│       │       ├── page.tsx             # ✏修正: canonical+hreflang、JSON-LD、ISR、データ更新日
│       │       ├── [sortType]/page.tsx  # ★新規: 並び順 path-tab(net_sales/salary/op_income/equity)
│       │       ├── overview/page.tsx    # ★新規(Phase 4): 1500 字深掘り
│       │       └── opengraph-image.tsx  # ★新規
│       ├── markets/
│       │   └── [id]/
│       │       ├── page.tsx             # ✏修正
│       │       ├── [sortType]/page.tsx  # ★新規
│       │       └── opengraph-image.tsx  # ★新規
│       ├── rankings/
│       │   └── [slug]/page.tsx          # ★新規(Phase 3): ランキングハブ
│       └── compare/
│           └── [idA]/[idB]/page.tsx     # ★新規(Phase 3): 2 社比較
├── components/
│   ├── RelatedCompanies.tsx             # ★新規: 同業界・同市場 TOP5
│   ├── ShareButtons.tsx                 # ★新規: X / はてブ
│   ├── DataFreshnessBadge.tsx           # ★新規: FY + 更新日
│   ├── JsonLd.tsx                       # ★新規: 型安全な <script type="application/ld+json">
│   ├── SortTypeTabs.tsx                 # ★新規: path-tab ナビ
│   └── (既存) Header / Footer / BreadCrumbs / GoogleAnalytics
├── lib/
│   ├── seo.ts                           # ★新規: canonical/hreflang/og:locale ヘルパ
│   ├── sitemap-data.ts                  # ★新規: sitemap.ts 用データ取得+整形
│   ├── ranking-hubs.ts                  # ★新規: スラッグ→クエリ設定の静的マップ
│   ├── og-image.tsx                     # ★新規: ImageResponse 共通レイアウト
│   └── factoids.ts                      # ★新規: 「今日の発見」生成
├── hooks/
│   └── (既存 GetData / GetDictionary を再利用、編集なし想定)
├── client/                              # ⛔ 編集禁止(Constitution III)
└── public/og/
    ├── default-ja.png                   # ★新規: 静的 OGP(Top 等)
    └── default-en.png                   # ★新規

CLAUDE.md                                 # ✏修正: SPECKIT START/END に plan.md パスを差込
```

**Structure Decision**: 既存の Next.js 15 App Router ディレクトリ構成(`typescript/app/[lang]/...`)を維持しながら、横断ロジックは `typescript/lib/` に新規切り出す(Next.js では特別な意味を持たない通常のモジュールフォルダ)。生成コード `typescript/client/**` には触れず、すべて `app/` `components/` `lib/` `hooks/` `public/` のみで完結させる。`sitemap.ts` と `robots.ts` は App Router 規約上 `typescript/app/` 直下に置く必要があるため、ロケール `[lang]` 配下ではなくルートに配置する(両ロケール分の URL を 1 ファイルで生成)。

## Phase 0: Outline & Research

詳細は [research.md](./research.md) を参照。主な決定事項:

- **sitemap 生成方式**: Next.js Metadata Routes(`app/sitemap.ts`)を採用。動的 sitemap index への切替は URL 数が 10,000 を超えた時点で `generateSitemaps` API に移行(FR-026)
- **OGP 画像生成**: `next/og` の `ImageResponse`(Edge Runtime)を採用。外部サービス不要(Constitution V 適合)
- **構造化データ実装**: 軽量な `<script type="application/ld+json">` インラインを採用(専用ライブラリ非導入)。型は `schema-dts` 互換の自前定義
- **並び順タブの URL 設計**: path segment(`/{lang}/industries/{id}/{sortType}`)を採用、query string は不採用(robots Disallow との衝突回避、FR-002 / FR-012 整合)
- **比較ページの事前生成範囲**: 上位 200 ペアのみ `generateStaticParams`、それ以外は `dynamicParams: true` + ISR。全組み合わせ約 4.5M ペアを事前生成しないことでビルド時間を制御
- **404 / soft-404 戦略**: 存在しない企業 ID には `notFound()` を呼び、Next.js 標準 404 を返す。並行して sitemap 出力時にも対象 URL を除外
- **データ更新日の取得元**: 既存 `getCompany` レスポンスに含まれる会計年度 / `updated_at`(なければ最新の document の `submitted_at` を使う)を表示。新規 API 追加は不要

## Phase 1: Design & Contracts

### 主要成果物

1. **Data model**: [data-model.md](./data-model.md) — Company / Industry / Market / RankingHub / SortType / SitemapEntry / DataFreshness の構造と関係を整理
2. **Interface contracts**: フロントエンド単独機能のため新規 HTTP API なし。代わりに以下を文書化:
   - [contracts/url-routes.md](./contracts/url-routes.md) — 全公開 URL の規約(path 構造、canonical 算出ルール、hreflang 対応表、sortType 値の語彙)
   - [contracts/sitemap-shape.md](./contracts/sitemap-shape.md) — `sitemap.xml` の各エントリの `loc` / `lastmod` / `changeFrequency` / `priority` / `alternates.languages` の決定ルール
3. **Quickstart / verification**: [quickstart.md](./quickstart.md) — Phase ごとの完了確認コマンド(`curl` / Lighthouse / GSC 操作 / GA4 ビュー設定)を 1 ファイルに集約
4. **Agent context**: `CLAUDE.md` の `<!-- SPECKIT START --> / <!-- SPECKIT END -->` ブロックに本 plan.md への相対パスを差込

### Post-design Re-check (Constitution)

Phase 1 で確定した URL 設計・データ取得経路は以下の通り Constitution に整合する:

- **I (OpenAPI)**: data-model.md に整理した Company / Industry / Market 取得は既存の generated client(`listSecurityCodes` / `listCompanies` / `listIndustries` / `listMarkets` / `getCompany`)で全て賄える。新規エンドポイント不要 → ✅
- **II (Runtime Boundaries)**: 全成果物が `typescript/` 配下。Ruby/Go への新規 HTTP・バッチ追加なし → ✅
- **III (Generated Code Read-Only)**: `typescript/client/**` 不変。生成 SDK の薄いラッパは `typescript/lib/` に新設 → ✅
- **IV (Gates)**: PR チェックリストとして「`make typescript/lint` 通過」「`npm run build` 通過」「手動確認したページの一覧」を quickstart.md に組み込み → ✅
- **V (External Services)**: `next/og` の `ImageResponse` は Next.js 標準。Hatenablog / Qiita / Zenn / X / GA4 / GSC は既存。新規 3rd-party 導入なし → ✅

**Post-design gate**: 5/5 Pass、Complexity Tracking エントリなし。

## Complexity Tracking

> なし。Constitution Check で違反は検出されていない。

---

## What `/speckit-plan` produced

- `plan.md` (this file)
- `research.md`
- `data-model.md`
- `quickstart.md`
- `contracts/url-routes.md`
- `contracts/sitemap-shape.md`
- `CLAUDE.md` の SPECKIT ブロック更新

## What `/speckit-plan` did NOT produce (next steps)

- `tasks.md` — `/speckit-tasks` で生成
- 実装コード — `/speckit-implement` または手動実装
