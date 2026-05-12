# Phase 0 Research: MAU 1000 達成ロードマップ

**Feature**: 001-mau-1000-roadmap
**Date**: 2026-05-11
**Purpose**: spec.md / Technical Context の不明点・技術選定を確定し、Phase 1 設計を進められる状態にする。

---

## R-1. Sitemap 生成方式

**Decision**: Next.js 15 App Router の Metadata Routes 機能(`typescript/app/sitemap.ts`)を採用する。URL 数が **10,000 を超えた段階**で `generateSitemaps` API を使った sitemap index 形式に移行する(FR-026 整合)。

**Rationale**:
- Next.js 標準。新規ライブラリ不要(Constitution V 整合)
- ビルド時に静的生成 + `export const revalidate = 86400` で日次更新を実現できる
- `MetadataRoute.Sitemap` 型で TypeScript チェックが効く
- `alternates.languages` で hreflang を sitemap 内に埋め込める(FR-001 + FR-004 を 1 ファイルで満たす)
- 50,000 URL / 50MB の単一 sitemap 上限以内であれば 1 ファイルで足りる。約 25,000 URL(企業 ~3,000 × 2 + 業界 33 × 4 並び順 × 2 + 市場 × 4 × 2 + 静的)は単一で収まる

**Alternatives considered**:
- 静的 XML を手書き / スクリプトで吐く: ビルドフロー外になり 鮮度・型安全性が落ちる → 不採用
- `next-sitemap` パッケージ: Next.js 15 と App Router で機能が古い+追加依存。Metadata Routes で足りるため → 不採用

---

## R-2. OGP 画像の動的生成

**Decision**: Next.js の `next/og` パッケージ(`ImageResponse`)を使い、`app/[lang]/companies/[id]/opengraph-image.tsx` 等のファイル規約で 1200×630 PNG を生成する。Edge Runtime 実行。

**Rationale**:
- Next.js 標準。`@vercel/og` の後継で公式サポート
- React の TSX 構文で HTML/CSS を書けるため保守性が高い
- Vercel 上で Edge Function として 自動配信、レスポンスは CDN キャッシュ
- 外部画像生成 SaaS を導入しない → Constitution V(External Service Boundaries)整合

**Constraints**:
- フォント: 日本語フォントは ImageResponse にバンドル必要(`fetch` + `unstable_cache`)。Noto Sans JP の subset を `typescript/public/fonts/` に配置する
- ファイルサイズ: 1 画像あたり ~50–200KB。CDN 経由配信で問題なし

**Alternatives considered**:
- 静的 PNG(全企業分プリレンダ): 6,000 枚 × 2 ロケール = 12,000 枚。ビルド時間と公開ストレージで非現実的 → 不採用
- Cloudinary などの画像生成 SaaS: Constitution V の External Service Review が必要、コスト発生 → 不採用

---

## R-3. 構造化データ(JSON-LD)実装

**Decision**: 専用ライブラリは導入せず、各 RSC 内で `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />` をインライン展開する。共通化のため `typescript/components/JsonLd.tsx` という薄いラッパを新設する。型は `schema-dts` 風の interface を自前で定義(必要分のみ:`Organization`, `WebSite`, `Corporation`, `BreadcrumbList`, `ItemList`, `CollectionPage`)。

**Rationale**:
- HTML へのインラインで充分、ライブラリ依存を増やさない(Constitution V 精神に整合)
- RSC のため Server-side で 1 度だけ stringify される。クライアント JS バンドルに影響なし
- 型は使う 6 スキーマ分のみで足り、`schema-dts` 全体(数百行の型)を入れる必要はない

**Alternatives considered**:
- `schema-dts` パッケージ: フルセット型が必要十分以上に重く、tree-shaking 後でも開発体験はそれほど向上しない → 不採用
- `next-seo` パッケージ: 内部で JSON-LD 出力もサポートするが、Next.js 15 の Metadata API と二重管理になる → 不採用

---

## R-4. 並び順タブの URL 設計

**Decision**: `path segment` で実装する。具体的には `/{lang}/industries/{id}/{sortType}` および `/{lang}/markets/{id}/{sortType}`。デフォルト(`net_sales`)のみ `/{lang}/industries/{id}` に正規化(canonical 設定)。

**Rationale**:
- robots.txt は `Disallow: /*?sortType=*` でクエリ文字列パターンを除外する(FR-002)。同じ仕組みで sortType をクエリ実装すると **インデックスさせたい URL がブロックされる** → 重大バグの予防
- path segment URL は GSC で個別 URL として認識され、`<title>` 差別化(FR-013)がそのままインデックス時の表示に効く
- ISR(`revalidate=3600`)が path-key で動作する

**Alternatives considered**:
- クエリパラメータ(`?sortType=salary`): FR-002 と衝突。robots の Disallow を緩める案もあるが、クロールバジェット浪費(検索クエリ `?q=` を含む)を防ぐ目的が崩れる → 不採用
- 値ごとに独立ルート(`/industries/{id}-salary`): 動的ルート爆発、保守性低下 → 不採用

**sortType の語彙**(全ロケール共通の URL 用 slug):

| slug | 並び順 | カラム |
|------|--------|--------|
| (なし) | デフォルト(売上) | `net_sales` desc |
| `salary` | 平均年収 | `average_annual_salary` desc |
| `op-income` | 営業利益 | `operating_income` desc |
| `equity` | 自己資本比率 | `equity_to_asset_ratio` desc |

`<title>` での日本語表示は `dictionaries/{lang}.json` の `sortType.{slug}` から引く。

---

## R-5. 比較ページ(`/{lang}/compare/{idA}/{idB}`)の事前生成範囲

**Decision**: `generateStaticParams` で「同業界・売上規模が近い上位 200 ペア」を事前生成する。それ以外は `dynamicParams: true` + `export const revalidate = 86400` で on-demand ISR にする。

**Rationale**:
- 全 3,000 社の組み合わせは C(3000, 2) ≈ 4.5M ペア。Vercel ビルドタイムアウト・成果物サイズ的に非現実的
- 上位 200 ペアは「同業界トップ 10 × ペア(45) × 主要 5 業界 ≒ 225 → 200 に丸め」。検索流入も「{A社} {B社} 比較」系で需要が見込めるトップから優先
- on-demand ISR は初回アクセス時にだけ生成、2 回目以降はキャッシュヒット。低頻度ペアでもインデックス対象に含められる

**Alternatives considered**:
- 全ペア事前生成: ビルド時間爆発、Vercel 月間ビルド時間予算超過 → 不採用
- すべて on-demand ISR(`generateStaticParams` 空): TTFB が悪化、初回ユーザー体験が低下 → 不採用

---

## R-6. データ更新日 / 会計年度の取得元

**Decision**: 既存の `getCompany`/ documents 関連レスポンスに含まれる **対象会計年度 (fiscal year)** と **最終 document 提出日** を再利用。新規 API 追加は不要。フィールドが命名揺れで取りづらい場合は `typescript/lib/seo.ts` 内に小さな normalizer を用意する。

**Rationale**:
- 既存 API のみで賄えるなら Constitution I(OpenAPI Contract)も触れずに済む
- 表示位置は H1 直下 / サイドバーで、レイアウト崩れがないことを Lighthouse CLS で担保(SC-009 整合)

**Alternatives considered**:
- 新規 API `/companies/{id}/freshness` を追加: OpenAPI 変更 + 全プロセス再生成が必要。コスト過大 → 不採用
- 静的に固定文言(「最新の有価証券報告書ベース」)のみ表示: ユーザーへの情報量不足、edge case 7 のリスク残存 → 不採用

---

## R-7. 404 / soft-404 対策

**Decision**: 動的ルートのデータ取得後に対象が存在しなければ Next.js の `notFound()` を呼び、`app/not-found.tsx`(必要なら locale 配下にも追加)で 404 HTML を返す。同時に `sitemap.ts` が出力時に「現存する企業 ID のみ」を列挙することで、消えた URL が sitemap に残らないようにする。

**Rationale**:
- `notFound()` は HTTP 404 を返す Next.js 標準の仕組み。soft-404(200 OK + 空) を確実に避けられる
- sitemap は日次再生成(`revalidate=86400`)なので、企業 ID が消えた翌日には URL も消える
- Google の de-indexing は 404 検出から数週間で完了するため、放置するより早く除外させたほうが「全体のインデックス品質」が上がる

---

## R-8. ハブページのコメンタリ生成戦略

**Decision**: スラッグごとに「テンプレ + データ駆動文」のハイブリッド。テンプレ文は H2 セクションと枠組み(導入・上位企業ハイライト・業界全体傾向・FAQ)を提供し、データ駆動文(FR-016 で要求される 3 文以上)は `typescript/lib/factoids.ts` の関数で次のような文を自動生成:

- 1 位企業の値と社名
- 上位 5 社の合計値・平均
- 同指標の業界別 TOP3
- 前年比成長(`lastYearNetSales` 差分から算出)
- 中央値 / TOP / BOTTOM の比率

**Rationale**:
- 完全テンプレ流用は doorway page 認定リスク(edge case 2 / risk 1)
- LLM 生成テキストは品質ブレ・コスト・External Service Review が必要 → Constitution V との衝突
- データ駆動の数値文は自動で 一意 になり、スラッグごとに毎回違う表現になる

---

## R-9. Lighthouse / Core Web Vitals 維持戦略

**Decision**: 以下を実装段階の non-functional checklist として固定:

- **画像**: OGP 画像は `priority` 不要(below the fold)。LCP に効くファビコン的サムネは未導入
- **フォント**: Noto Sans JP の subset(JIS 第 1 水準)を `next/font/local` で自家ホスト、`display: swap`
- **JS バンドル**: Server Components を主用、Client Components(`'use client'`)はシェアボタンなどインタラクションが必須な箇所のみ
- **CSS**: 既存の `styles/globals.css` を維持、Tailwind 等の追加は不要
- **CLS**: データ更新日バッジ・関連企業セクション・並び順タブは すべて初期 HTML に含めて遅延挿入しない
- **INP**: 並び順切替は `<Link>`(prefetch あり)で動かし、クライアント側状態管理は導入しない

**Rationale**: SC-009 の Core Web Vitals 閾値(LCP ≤ 2.5s / INP ≤ 200ms / CLS ≤ 0.1)は Google ランキングに直接効く。SEO 施策で本末転倒にしないため、設計段階で破壊しない選択を固定する。

---

## R-10. 国際化(日本語 / 英語)スコープ

**Decision**: 英語ページは技術 SEO(sitemap / hreflang / canonical / og:locale / JSON-LD)のみ整備し、コンテンツ拡張(ランキングハブ / 比較ページ / 業界 overview / 関連企業)は **日本語のみ**を対象とする。ただしルート構造は両ロケール対応で実装し、英語版で追加コンテンツが必要になったときに辞書追加で展開できる形にする。

**Rationale**:
- spec.md の Assumptions に明記された方針(MAU 1000 の内訳は日本語 ~950 / 英語 ~50)
- 1 人 × 15h/週の運用工数で英語コンテンツまでカバーすると Hatenablog 執筆と両立不能
- ルート構造を 2 ロケール対応にしておけば後から英訳辞書を足すだけで展開可能

**Alternatives considered**:
- 英語ハブも初期から作成: 工数超過、品質低下 → 不採用
- 英語版を完全 deprecate(`/en` を 410 化): SEO 上はクリーンだが ユーザー目標として English UI 自体は維持したい → 不採用

---

## R-11. GA4 / GSC 設定変更の責務分担

**Decision**: GA4 の内部トラフィック除外 / 実 MAU 計測ビュー / Engaged Users 28d オーディエンス、および GSC のドメインプロパティ登録 / sitemap 提出は **オペレーター手作業**として扱い、コード変更には含めない。実施手順は `quickstart.md` の Phase 0 / Phase 1 セクションに完全な操作手順として記録する。

**Rationale**:
- GA4 / GSC の設定は UI 操作で行うのが現実的(API 化は工数に見合わない)
- オペレーター責務として明示することで、PR レビュアーが「これはコード差分では満たされない」と判別しやすい

---

## All NEEDS CLARIFICATION resolved

spec.md / Technical Context に残っていた不明点は本ドキュメントで全て確定した。Phase 1 設計に進む準備が整っている。
