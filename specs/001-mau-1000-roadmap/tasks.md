---
description: "Task list for MAU 1000 達成ロードマップ (001-mau-1000-roadmap)"
---

# Tasks: MAU 1000 達成ロードマップ

**Input**: Design documents in `/specs/001-mau-1000-roadmap/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/url-routes.md, contracts/sitemap-shape.md, quickstart.md
**Tests**: TypeScript には自動ユニットテストなし(Constitution IV / plan.md)。各タスクの検証は `make typescript/lint` + `docker compose run --rm typescript npm run build` + quickstart.md に列挙された手動ブラウザ確認で行う。

## PR 運用ルール

- **タスク = 1 PR** を原則とする。各タスクは独立したブランチで実装し、PR 本文に以下を必ず明記する:
  - 該当 Task ID(例: `T005`)
  - 影響範囲(TypeScript フロントエンドのみであることを明示)
  - 手動確認した URL のリスト(quickstart.md の検証コマンドを引用可)
  - `make typescript/lint` 通過 / `npm run build` 通過のチェック
- **`[P]` マークの意味**: 触るファイルが他タスクと重ならず、依存する先行タスクがすべてマージ済みであれば、並行して別ブランチで開発・PR を開いてよい。
- **依存タスクが未マージ**の場合、その PR は依存先がマージされるまでドラフトのままにしておく。
- **生成コード**(`typescript/client/**`)は本ロードマップ全体で**編集禁止**(Constitution III)。
- **Go / Ruby / OpenAPI 変更なし**(plan.md / Constitution II)を全 PR で守る。

## Format: `- [ ] [ID] [P?] [Story?] Description (file path)`

---

## Phase 0: Operator-only Setup (No PR)

> コードを書く前に **必ず**完了させる(plan.md / quickstart.md Phase 0)。PR は発生しない運用作業として扱う。

- [ ] OPS-001 GA4: 内部 / Developer Traffic 除外フィルタを Active にする(Admin → Data Settings → Data Filters)
- [ ] OPS-002 GA4: 探索レポート「実 MAU 計測」を作成(指標: アクティブ ユーザー数 / 行: 月の最初の日 / ビジュアル: 折れ線)。GA4 ユーザーセグメントは `engagement_rate` を直接条件にできないため、GA4 標準「アクティブ ユーザー数」指標(>10s engagement / コンバージョン / 2+ pageviews を満たすユーザー)で代用
- [ ] OPS-003 GA4: Admin → Audiences → 推奨テンプレート「Engaged users」から "Engaged Users 28d" オーディエンスを作成(メンバーシップ期間 28 日)
- [ ] OPS-004 GSC: ドメインプロパティ `https://www.company-ranking.net/` を登録 + 所有権確認

**Checkpoint**: GA4 探索レポート「実 MAU 計測」が表示され、Audiences に「Engaged Users 28d」が登録され、GSC ドメインプロパティが Verified。これがないと SC-001 / SC-006 の計測ができない。

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 後続フェーズが共通して依存する環境変数 / 基底 metadata の整備

- [ ] T001 `.env_sample` と `compose.yaml` に `NEXT_PUBLIC_SITE_URL=https://www.company-ranking.net` を追加し、`typescript/app/[lang]/layout.tsx` の `metadataBase` を `new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")` で参照するよう変更する(canonical 計算の基底値が正しく解決される状態にする)

**Checkpoint**: ローカルビルドで `<link rel="canonical">` のホストが localhost、本番ビルドで `www.company-ranking.net` に解決されることを確認できる。

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 全 User Story が依存する共通ヘルパ / 型 / UI プリミティブ。Phase 2 の全タスクが完了するまで Phase 3 以降のタスクは開始できない(`[P]` 同士は並行可)。

- [ ] T002 [P] `typescript/lib/seo.ts` を新規作成し、`canonicalFor(path, lang)` / `hreflangAlternates(path)` / `ogLocaleFor(lang)` を実装する(contracts/url-routes.md §4–6 のルールに準拠)
- [ ] T003 [P] `typescript/components/JsonLd.tsx` を新規作成し、`<script type="application/ld+json">` の薄いラッパと `Organization` / `WebSite` / `Corporation` / `BreadcrumbList` / `ItemList` / `CollectionPage` の自前 interface を定義する(research.md R-3)
- [ ] T004 [P] `typescript/lib/og-image.tsx` を新規作成し、`ImageResponse` 用の共通レイアウト(1200×630)と Noto Sans JP のフォントローダ(`typescript/public/fonts/` に配置)を実装する。本タスクではローダのみで、各エンドポイントは Phase 4 で実装(research.md R-2)

**Checkpoint**: 3 つの共通モジュールが `npm run build` を通過し、import エラーが出ない状態。

---

## Phase 3: User Story 1 - 検索エンジン経由でランキングページに到達する (Priority: P1) 🎯 MVP

**Goal**: SEO 基盤(sitemap / robots / canonical / hreflang / og:locale / soft-404 防止)を整えて Google にインデックスさせる。spec.md SC-006 の達成。

**Independent Test**: quickstart.md Phase 1 の `curl` 検証コマンドが全て期待値を返し、GSC で sitemap 提出ステータスが「成功」になり、Indexed URLs ≥ 500 になる。

### Implementation for User Story 1

- [ ] T005 [P] [US1] `typescript/app/sitemap.ts` と `typescript/lib/sitemap-data.ts` を新規作成し、静的ページ + 全企業 + 全業界 + 全市場(両ロケール)の URL を `MetadataRoute.Sitemap` で返す。`lastModified` / `changeFrequency` / `priority` / `alternates.languages` は contracts/sitemap-shape.md §3 に従う。`export const revalidate = 86400`。存在しない企業 ID は `listSecurityCodes()` の戻り値で除外(FR-007b)
- [ ] T006 [P] [US1] `typescript/app/robots.ts` を新規作成し、`MetadataRoute.Robots` で `User-agent: *` / `Allow: /` / `Disallow: /*?q=*` / `Disallow: /*?sortType=*` / `Sitemap: $NEXT_PUBLIC_SITE_URL/sitemap.xml` を出力(contracts/url-routes.md §7)
- [ ] T007 [P] [US1] `typescript/public/og/default-ja.png` および `typescript/public/og/default-en.png`(1200×630)を追加(静的 OGP フォールバック)
- [ ] T008 [US1] `typescript/app/[lang]/layout.tsx` を修正し、(1) `og:locale` を `lang` から動的に切替(`ja` → `ja_JP`、`en` → `en_US`、FR-003)、(2) `hreflang` alternates を `lib/seo.ts` 経由で出力、(3) `<JsonLd>` で `Organization` + `WebSite` を埋め込み、(4) 既定 OGP として T007 の `default-ja.png` / `default-en.png` を `openGraph.images` に指定する。依存: T002, T003, T007
- [ ] T009 [P] [US1] `typescript/app/[lang]/companies/[id]/page.tsx` を修正し、(1) `getCompany` が `notFound` 相当の応答なら `notFound()` を呼ぶ(FR-007b)、(2) `generateMetadata` で `lib/seo.ts` 経由の canonical + hreflang を出力、(3) 既存の `<head>` ハードコードを除去。依存: T002
- [ ] T010 [P] [US1] `typescript/app/[lang]/companies/page.tsx`(企業リスト)を修正し、`generateMetadata` で canonical(クエリ無視) + hreflang を出力。依存: T002
- [ ] T011 [P] [US1] `typescript/app/[lang]/industries/[id]/page.tsx` を修正し、存在しない `id` は `notFound()`、canonical + hreflang を出力。依存: T002
- [ ] T012 [P] [US1] `typescript/app/[lang]/markets/[id]/page.tsx` を修正し、存在しない `id` は `notFound()`、canonical + hreflang を出力。依存: T002
- [ ] T013 [US1] **GSC 操作(OPS)**: 本番デプロイ後に Search Console → Sitemaps で `sitemap.xml` を提出し、主要 20 URL を URL Inspection で手動インデックス申請。PR ではなく運用タスク(quickstart.md Phase 1)。依存: T005–T012 が本番デプロイ済み

**Checkpoint** (SC-006): sitemap 提出「成功」、GSC Indexed URLs ≥ 500、canonical / hreflang / og:locale が主要ページで正しい。実 MAU が 200–300 へ伸び始める。

---

## Phase 4: User Story 2 - ランキングページから関連ページを回遊する (Priority: P2)

**Goal**: 構造化データ・関連企業・並び順タブ・動的 OGP・データ更新日バッジで内部回遊と SERP リッチ化を実現する。spec.md SC-007 の達成。

**Independent Test**: Google Rich Results Test で `Corporation` schema 検出、`/ja/industries/{id}/salary` が 200 OK で `<title>` に「平均年収」を含む、企業詳細ページ下部に同業界 / 同市場 TOP5 が表示、`/ja/companies/{id}/opengraph-image` が PNG を返す。

### 内部リンク / バッジ用のプリミティブ(新規ファイル群)

- [ ] T014 [P] [US2] `typescript/components/DataFreshnessBadge.tsx` を新規作成(`fiscalYear` + `updatedAt` を H1 直下に表示、CLS を避ける固定高さ。FR-014a / data-model.md §7)
- [ ] T015 [P] [US2] `typescript/components/SortTypeTabs.tsx` を新規作成(path-segment ベースの 4 タブ、現在のタブを `aria-current="page"`。FR-012 / data-model.md §4)
- [ ] T016 [P] [US2] `typescript/components/RelatedCompanies.tsx` を新規作成(同業界 TOP5 + 同市場 TOP5、SSR で初期 HTML に含める、CLS 0)。FR-011
- [ ] T017 [P] [US2] `typescript/components/ShareButtons.tsx` を新規作成(X intent + はてブ。`'use client'` は不要、`<a target="_blank">` のみ)。FR-014
- [ ] T018 [P] [US2] `typescript/lib/sort-type.ts` を新規作成し `SORT_TYPES` const と `SortType` 型を export。`typescript/dictionaries/ja.json` / `en.json` に `sortType.{slug}` の表示語(平均年収 / 営業利益 / 自己資本比率 等)を追記。data-model.md §4 / contracts/url-routes.md §2

### 既存ページへの統合(JSON-LD + バッジ + 関連企業)

- [ ] T019 [US2] `typescript/app/[lang]/companies/[id]/page.tsx` に `<JsonLd>` で `Corporation` + `BreadcrumbList` を出力、`<DataFreshnessBadge>` を H1 直下、`<RelatedCompanies>` を本文下部、`<ShareButtons>` をサイドバー/末尾に挿入。FR-008 / FR-011 / FR-014 / FR-014a。依存: T003, T009, T014, T016, T017
- [ ] T020 [US2] `typescript/app/[lang]/industries/[id]/page.tsx` に `<JsonLd>` で `ItemList` + `BreadcrumbList` + `CollectionPage`、`<DataFreshnessBadge>`、`<SortTypeTabs current="net_sales">` を挿入し、`export const revalidate = 3600`。FR-008 / FR-009 / FR-014a。依存: T003, T011, T014, T015
- [ ] T021 [US2] `typescript/app/[lang]/markets/[id]/page.tsx` に同様の構造化データ + バッジ + タブ + ISR を適用。FR-008 / FR-009 / FR-014a。依存: T003, T012, T014, T015

### 並び順 path-tab ルート(新規)

- [ ] T022 [US2] `typescript/app/[lang]/industries/[id]/[sortType]/page.tsx` を新規作成。`generateStaticParams` で `SORT_TYPES` の `salary` / `op-income` / `equity` の 3 値に限定列挙(`net_sales` は親ルート canonical へ)。`<title>` に並び順語を含める(FR-013)。canonical は self、`net_sales` を踏んだ場合は親 URL に redirect or 404。ISR 1h。依存: T002, T011, T015, T018
- [ ] T023 [US2] `typescript/app/[lang]/markets/[id]/[sortType]/page.tsx` を新規作成(T022 と同じ規約で market 用)。依存: T002, T012, T015, T018
- [ ] T024 [US2] `typescript/lib/sitemap-data.ts` を更新し、業界 × sortType 3 値 と 市場 × sortType 3 値 のエントリを追加(contracts/sitemap-shape.md §3.3 / §3.4)。依存: T005, T022, T023

### 動的 OGP 画像(Edge Runtime)

- [ ] T025 [P] [US2] `typescript/app/[lang]/companies/[id]/opengraph-image.tsx` を新規作成。1200×630、企業名 / 証券コード / 売上 / 業界を表示。FR-010。依存: T004
- [ ] T026 [P] [US2] `typescript/app/[lang]/industries/[id]/opengraph-image.tsx` を新規作成(業界名 + 企業数)。FR-010。依存: T004
- [ ] T027 [P] [US2] `typescript/app/[lang]/markets/[id]/opengraph-image.tsx` を新規作成(市場名 + 企業数)。FR-010。依存: T004

**Checkpoint** (SC-007): Rich Results Test で `Corporation` 検出、4 種並び順 path-tab が 200、関連企業セクション表示、動的 OGP 画像 200、データ更新日バッジ表示、実 MAU 200–300。

---

## Phase 5: User Story 3 - 検索意図特化のハブページに直接ランディングする (Priority: P3)

**Goal**: ランキングハブ + 比較ページ + トップページ強化で、ロングテール検索意図を獲得する。spec.md SC-008 の達成。

**Independent Test**: 20–30 ハブ URL が 200 OK、各ハブで Lighthouse SEO ≥ 95、ハブ本文に固有数値文 3 文以上、比較ページの上位 200 ペアが prebuilt、トップに TOP10 + ファクトイド + ハブティーザー。

### ハブ / ファクトイドのプリミティブ

- [ ] T028 [P] [US3] `typescript/lib/ranking-hubs.ts` を新規作成し、初期 20–30 スラッグの静的マップ(`slug` / `sortType` / `industryId?` / `marketId?` / `titleJa` / `introJa` / `topNCompanies`)を定義(data-model.md §5 / contracts/url-routes.md §3)
- [ ] T029 [P] [US3] `typescript/lib/factoids.ts` を新規作成し、決定論的に「1 位 / 上位 5 社合計シェア / YoY 成長 / 中央値」等の固有数値文を生成する関数群を実装(research.md R-8 / FR-016 の anti-thin-content 要件 ≥ 3 文)

### 新規ルート

- [ ] T030 [US3] `typescript/app/[lang]/rankings/[slug]/page.tsx` を新規作成。`generateStaticParams` で `ranking-hubs.ts` のスラッグに限定。800 字以上のコメンタリ(導入 + H2 + 数値固有文 ≥ 3) + ランキングテーブル + パンくず + `<JsonLd>` `ItemList` + 関連リンク ≥ 5。SSG + `revalidate=86400`。FR-015 / FR-016。依存: T002, T003, T028, T029
- [ ] T031 [US3] `typescript/app/[lang]/compare/[idA]/[idB]/page.tsx` を新規作成。`generateStaticParams` で上位 200 ペア(同業界 × 売上規模近接)を事前生成、`dynamicParams = true` + `revalidate=86400` で on-demand ISR。canonical は `idA < idB` に正規化。FR-017 / research.md R-5。依存: T002, T003
- [ ] T032 [US3] `typescript/app/[lang]/page.tsx`(トップ)を修正し、ファーストビューに(1) 売上 TOP10 ミニテーブル、(2)「今日の発見」ファクトイド、(3) ランキングハブ 3 件のティーザーを追加。FR-018。依存: T028, T029

### sitemap 反映

- [ ] T033 [US3] `typescript/lib/sitemap-data.ts` を更新し、ランキングハブ全件 + 比較ページ prebuilt 200 ペアを sitemap エントリに追加。FR-019 / contracts/sitemap-shape.md §3.6 / §3.7。依存: T024, T030, T031

**Checkpoint** (SC-008): 30+ ハブ Indexed、5+ ハブが GSC TOP30 内 impression、累計実 MAU 400–600、Lighthouse SEO ≥ 95 / Perf ≥ 80。

---

## Phase 6: User Story 4 - 外部メディアからの被リンク・流入を獲得する (Priority: P3)

**Goal**: Hatenablog / Qiita-Zenn / X を通じた Referral と被リンクの獲得。spec.md SC-005 の達成。

**Independent Test**: GA4 Referral で `hatenablog.jp` 月間 ≥ 50、GSC 被リンクレポートに新規外部ドメイン反映。

> **本フェーズはコード変更を必要としない運用タスク**(コード側のシェア導線は T017 で完了済み)。PR は発生しないため OPS タスクとして列挙する。

- [ ] OPS-005 [US4] Hatenablog 週 2 本ペースの長文記事を 12 週継続(FR-020)
- [ ] OPS-006 [US4] Qiita または Zenn に技術記事 1 本以上を投稿(FR-021)
- [ ] OPS-007 [US4] X で週 2–3 投稿(OGP カードを活用、FR-022)

**Checkpoint**: SC-005(Hatenablog 経由 ≥ 50/月)、SC-004(GSC Indexed 4,000+ / TOP10 クエリ 50+)へ寄与。

---

## Phase 7: Polish & Cross-Cutting Concerns (Phase 4 of roadmap)

**Purpose**: 複利化と最終最適化。各タスクは独立 PR として実装可能。

- [ ] T034 [P] 業界 overview ルート `typescript/app/[lang]/industries/[id]/overview/page.tsx` を新規作成(1,500 字コメンタリ + 主要プレイヤー + 埋込ミニランキング、ISR 24h)。FR-025。依存: T011, T028, T029
- [ ] T035 [P] `typescript/lib/sitemap-data.ts` に業界 overview エントリを追加(両ロケール × 33 業界 = 66 件)。FR-019。依存: T033, T034
- [ ] T036 [P] `typescript/lib/ranking-hubs.ts` を 80–100 スラッグまで拡張(業界別年収 / 利益率 / YoY 成長率)。FR-024。依存: T028
- [ ] T037 `typescript/app/sitemap.ts` を `generateSitemaps()` ベースの sitemap index 形式へ移行(URL 数が 10,000 を超えた時点でのみ実施、`sitemap-companies.xml` / `sitemap-rankings.xml` 等に分割)。FR-026。依存: T033, T035, T036
- [ ] T038 [P] [OPS] GSC「impressions あり / CTR 低」クエリの週次抽出と `<title>` / `description` 最適化(年号・規模表記・「最新版」フックを含める)。FR-023。週次オペレーション、コード変更は対象ページの `generateMetadata` 内コピー修正のみ
- [ ] T039 [P] [OPS] Top 5 ページの Lighthouse mobile スコアを週次計測し、80 を下回ったら改善 PR を起こす。FR-027 / SC-009
- [ ] T040 [P] 既存 `typescript/lib/SortTypes.tsx`(query-string ベースのレガシー UI)を T015 の `components/SortTypeTabs.tsx` で完全置換し、レガシーコンポーネントを削除する(FR-002 の `?sortType=*` Disallow と整合させる)。依存: T015, T022, T023
- [ ] T041 quickstart.md の Phase 1–4 検証コマンドを一通り通過することを確認する最終チェック PR(変更が無ければ checklist の文書更新のみ)

**Final Checkpoint** (SC-001 / SC-009): 実 MAU ≥ 1,000、Indexed ≥ 4,000、平均セッション ≥ 40s、ページ/セッション ≥ 2.5、LCP ≤ 2.5s / INP ≤ 200ms / CLS ≤ 0.1、Bot 割合 < 30%。

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 0 (OPS) ──┐
                ├── Phase 1 (T001) ── Phase 2 (T002, T003, T004 [P])
                                          │
                                          ├── Phase 3 (US1)
                                          ├── Phase 4 (US2)   ← Phase 3 のページ修正がマージ後に着手
                                          ├── Phase 5 (US3)   ← Phase 4 と並行可
                                          └── Phase 6 (US4) [OPS のみ、いつでも開始可]
                                                  │
                                                  └── Phase 7 (Polish)
```

- **Phase 0 (OPS)** は計測の前提のため即時開始。コードフェーズと並行可。
- **Phase 1 (T001)** がマージされるまで Phase 2 を本番デプロイしてはいけない(metadataBase が間違ったホストで吐かれる)。
- **Phase 2 (T002–T004)** の 3 タスクは互いに独立で `[P]`。3 つ全てマージ後に Phase 3+ の実装タスクが安定して進められる。
- **Phase 3 (US1)** は MVP。SC-006 達成までこの 8 PR(T005–T012)を最優先で揃える。T013 は本番反映後の運用タスク。
- **Phase 4 (US2)** は Phase 3 のページ修正(T009–T012)をベースに重ねるため、対象ページの先行 PR がマージされた後で個別 PR を起こす。
- **Phase 5 (US3)** は Phase 4 のコンポーネント(`SortTypeTabs` / `RelatedCompanies` / `DataFreshnessBadge`)を直接は使わないため、Phase 4 と並行で進められる(担当者が分かれる場合)。ただし `sitemap-data.ts` 更新(T033)は T024 と直列。
- **Phase 7** は Phase 5 完了後に着手。T037(sitemap index 化)は URL 数が 10k を超えてから。

### Task-level Dependencies (要点)

| Task | 依存する完了済みタスク | 触るファイル(主) |
|------|-----------------------|------------------|
| T001 | — | `.env_sample`, `compose.yaml`, `app/[lang]/layout.tsx` |
| T002 | T001 | `lib/seo.ts`(新規) |
| T003 | — | `components/JsonLd.tsx`(新規) |
| T004 | — | `lib/og-image.tsx`(新規), `public/fonts/*` |
| T005 | T002 | `app/sitemap.ts`, `lib/sitemap-data.ts`(新規) |
| T006 | T001 | `app/robots.ts`(新規) |
| T007 | — | `public/og/default-*.png`(新規) |
| T008 | T002, T003, T007 | `app/[lang]/layout.tsx` |
| T009 | T002 | `app/[lang]/companies/[id]/page.tsx` |
| T010 | T002 | `app/[lang]/companies/page.tsx` |
| T011 | T002 | `app/[lang]/industries/[id]/page.tsx` |
| T012 | T002 | `app/[lang]/markets/[id]/page.tsx` |
| T013 | T005–T012 本番デプロイ済 | (OPS) |
| T014–T017 | — | 各新規コンポーネント |
| T018 | — | `lib/sort-type.ts`(新規), `dictionaries/*.json` |
| T019 | T003, T009, T014, T016, T017 | `app/[lang]/companies/[id]/page.tsx` |
| T020 | T003, T011, T014, T015 | `app/[lang]/industries/[id]/page.tsx` |
| T021 | T003, T012, T014, T015 | `app/[lang]/markets/[id]/page.tsx` |
| T022 | T002, T011, T015, T018 | `app/[lang]/industries/[id]/[sortType]/page.tsx`(新規) |
| T023 | T002, T012, T015, T018 | `app/[lang]/markets/[id]/[sortType]/page.tsx`(新規) |
| T024 | T005, T022, T023 | `lib/sitemap-data.ts` |
| T025 | T004 | `app/[lang]/companies/[id]/opengraph-image.tsx`(新規) |
| T026 | T004 | `app/[lang]/industries/[id]/opengraph-image.tsx`(新規) |
| T027 | T004 | `app/[lang]/markets/[id]/opengraph-image.tsx`(新規) |
| T028 | — | `lib/ranking-hubs.ts`(新規) |
| T029 | — | `lib/factoids.ts`(新規) |
| T030 | T002, T003, T028, T029 | `app/[lang]/rankings/[slug]/page.tsx`(新規) |
| T031 | T002, T003 | `app/[lang]/compare/[idA]/[idB]/page.tsx`(新規) |
| T032 | T028, T029 | `app/[lang]/page.tsx` |
| T033 | T024, T030, T031 | `lib/sitemap-data.ts` |
| T034 | T011, T028, T029 | `app/[lang]/industries/[id]/overview/page.tsx`(新規) |
| T035 | T033, T034 | `lib/sitemap-data.ts` |
| T036 | T028 | `lib/ranking-hubs.ts` |
| T037 | T033, T035, T036 | `app/sitemap.ts` |
| T040 | T015, T022, T023 | `lib/SortTypes.tsx`(削除) + 参照箇所 |

### Parallel Opportunities(担当者を分けたい場合)

- **Phase 2 内**: T002 / T003 / T004 を 3 並列で実装可
- **Phase 3 内**: T005(sitemap)/ T006(robots)/ T007(OGP assets)/ T009–T012(各ページ修正)は別ファイルなので最大 7 並列
- **Phase 4 内のプリミティブ**: T014 / T015 / T016 / T017 / T018 / T025 / T026 / T027 は最大 8 並列(`opengraph-image.tsx` は別エンドポイント)
- **Phase 4 のページ統合**: T019 / T020 / T021 は別ページなので 3 並列。ただし依存タスク(T014–T017)が先行マージ必要
- **Phase 4 の並び順タブ**: T022 / T023 は 2 並列
- **Phase 5 のプリミティブ**: T028 / T029 は 2 並列
- **Phase 5 のページ**: T030 / T031 / T032 は別ファイルで 3 並列
- **Phase 7**: T034 / T036 / T038 / T039 / T040 は別ファイル/別運用なので並列可

### Within Each User Story

- 共通プリミティブ(コンポーネント / lib モジュール)→ それを使うページの統合 → sitemap への反映、の順で積み上げる
- 1 PR の差分が大きくなりそうな場合(例: T019 で `companies/[id]/page.tsx` が 200 行超になる)は、JSON-LD と関連企業セクションを別 PR に分割して構わない

---

## Parallel Example: Phase 3 (US1) を 2 人で進める場合

```text
Developer A の PR ブランチ群(直列):
  feat/T001-metadata-base
  → feat/T002-lib-seo
  → feat/T005-sitemap
  → feat/T008-layout-hreflang

Developer B の PR ブランチ群(直列、T002 マージ後):
  feat/T003-jsonld-component (T002 と並行可)
  → feat/T009-company-detail-canonical
  → feat/T010-companies-list-canonical
  → feat/T011-industry-canonical
  → feat/T012-market-canonical

並行スレッド(いつでも):
  feat/T006-robots (T001 後)
  feat/T007-default-og-assets
```

8 PR が概ね 1–2 週間で揃い、Phase 1 (Week 1–2) の目標(sitemap 提出 + Indexed ≥ 500)に到達する想定。

---

## Implementation Strategy

### MVP First (User Story 1 Only) — Week 1–2

1. Phase 0(OPS-001 〜 OPS-004)を着手と同時に進行
2. Phase 1(T001)→ Phase 2(T002–T004)
3. Phase 3(T005–T012)を順次 PR 化、本番デプロイ
4. T013 で GSC sitemap 提出 + 主要 URL Inspection
5. **STOP & VALIDATE**: quickstart.md Phase 1 セクションのコマンドを全て通過、GSC 「成功」を確認
6. SC-006 達成を確認してから Phase 4 へ

### Incremental Delivery — Week 3–8

1. Phase 4(US2)を Week 3–4 で完了 → SC-007(実 MAU 200–300、Rich Results 検出)
2. Phase 5(US3)を Week 5–8 で完了 → SC-008(30+ ハブ Indexed、実 MAU 400–600)
3. Phase 6(US4 / OPS)は Week 3 から並走して継続

### Parallel Team Strategy

工数 1 人 × 15h/週(plan.md 制約)なので原則 1 人運用。ただし Hatenablog 執筆(OPS-005)は週末に分離するのが現実的。OPS タスクと PR タスクを同時並行で進める。

### 工数不足時の削減優先順位(plan.md より)

1. 比較ページ(T031)を後ろ倒し
2. EN コンテンツの追加分は対象外のまま据え置き
3. OGP 動的画像(T025–T027)を後ろ倒し(静的 default で運用)

---

## Notes

- **`[P]` の判定基準**: (a) 触るファイルが他タスクと重ならない、(b) 依存先タスクが全てマージ済み、の AND 条件
- **PR 本文テンプレ**: quickstart.md 末尾「共通: PR チェックリスト」を必ず本文に貼り付ける
- **`make typescript/lint` / `npm run build` のいずれかが失敗した状態の PR は merge しない**(Constitution IV)
- **手動確認が必要なページが多いタスク**(T020 / T021 など)は、PR 本文に確認した URL を箇条書きで列挙する
- **生成コード**(`typescript/client/**`)を編集する PR は自動的に reject(Constitution III)
- **Go / Ruby / OpenAPI を触る差分**が紛れ込んでいたら、その PR は本フィーチャー外のため別 PR に切り出す(Constitution I / II)
