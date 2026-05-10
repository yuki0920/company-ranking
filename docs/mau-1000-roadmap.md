# Company-Ranking: 月間アクティブユーザー 1000 達成プラン (3ヶ月)

## Context

**なぜこの計画が必要か**

- GA4 によると過去 28 日の MAU は 252 だが、Singapore 98 / China 47 は engagement rate 0% / セッション 0 秒で**ほぼ確実に bot**。実質ユーザーは Japan 75 + US 26 ≒ **約 100 人**。
- ユーザー目標は「3ヶ月以内に MAU 1000」。実質 10 倍成長が必要。
- 唯一伸びているチャネルは **Organic Search (前期 42→ 当期 55, +31%)**。一方サイトには SEO 基盤(sitemap / robots / JSON-LD / hreflang / OGP)が一切なく、伸びしろが大きい。
- データ資産は強い: ~3000 上場企業 × 33 業界 × 2 ロケール → 数千ページ単位の SEO ターゲット可能 URL があるが Google が発見できていない。
- 有料広告は使わない方針。コード改善 + コンテンツ追加 + 外部発信(はてブ・X・Qiita/Zenn) の組み合わせで達成する。
- 戦略の核: **日本語の Organic Search を ~50 → ~750 に拡大**することで全体 1000 に到達。EN は技術的整備のみで放置(MAU 26 はノイズフロア以下)。

**触ってはいけないファイル**

- `go/**/*.gen.go`, `go/models/*.xo.go` (oapi-codegen / xo 生成)
- `typescript/client/**` (openapi-generator-cli 生成)
- 上記を変更する必要が出たら `openapi/openapi.yaml` を編集 → `make go/generate/server` & `make typescript/generate/client` を実行。

---

## Phase 0 (Day 1, 必ず最初): GA4 計測精度の確立

これをやらないと以降の施策効果が測れない。**最重要。**

- GA4 Admin → Data Streams → Configure tag settings → **Define internal traffic** で自宅/職場 IP を登録 → Data Filters で「Internal Traffic」を Active 化(Exclude)。
- Admin → Data Settings → Data Filters → **Developer traffic** Exclude を有効化。
- **「実 MAU 計測用 Comparison」を作成**: `Engagement rate > 0` AND `Average session duration > 5s`。これを以降のレポートのデフォルトビューにする。Singapore/China を地域単位で除外しないこと(VPN ユーザー除外リスク)。
- **GSC ドメインプロパティ**で `https://www.company-ranking.net/` を登録(URL prefix ではなく Domain property)。
- 週次 KPI 用に「Engaged Users 28d」カスタムオーディエンスを作成 → これを実 MAU 進捗の北極星にする。

---

## Phase 1 — Week 1-2: SEO 基盤整備(全ての土台)

期待リフト: **+10〜30 MAU**(インデックス進行中)。本フェーズは Phase 2-4 の効果を **可能にする** 前提条件。

### 実装タスク

1. **`typescript/app/sitemap.ts` 新規作成** — `MetadataRoute.Sitemap` を返す関数。
   - 静的: `/ja`, `/en`, `/{lang}/companies`, `/{lang}/contact`, `/{lang}/terms_of_use`
   - 動的: `listSecurityCodes()`, `listIndustries()`, `listMarkets()` を呼んで両ロケール分の URL を吐く。`typescript/hooks/GetData.ts` のクライアント関数を再利用。
   - 各エントリに `alternates: { languages: { ja, en } }` を付与。
   - `changeFrequency`: rankings は `weekly`, 詳細は `monthly`。
   - 全件 ~6,000 URL は単一サイトマップで OK(50k 上限)。`export const revalidate = 86400`。

2. **`typescript/app/robots.ts` 新規作成** — `MetadataRoute.Robots`。
   - `Allow: /`, `Disallow: /*?q=*` と `/*?sortType=*` でクロールバジェット浪費を防止。
   - `sitemap` フィールドに sitemap URL。

3. **`typescript/app/[lang]/layout.tsx:32` の og:locale バグ修正**
   - 現状: `locale: "ja_JP"` ハードコード(英語ページでも ja_JP)。
   - 修正: `locale: lang === "ja" ? "ja_JP" : "en_US"`。
   - 同ファイル `alternates` に `languages: { 'ja-JP': '/ja', 'en-US': '/en' }` を追加。

4. **動的 4 ページの `generateMetadata` に canonical + hreflang を実装**
   - `typescript/app/[lang]/companies/[id]/page.tsx`
   - `typescript/app/[lang]/companies/page.tsx`
   - `typescript/app/[lang]/industries/[id]/page.tsx`
   - `typescript/app/[lang]/markets/[id]/page.tsx`
   - 各 `generateMetadata` で `alternates: { canonical: <self URL>, languages: { ja: <ja URL>, en: <en URL> } }` を返す。

5. **GSC で sitemap 提出 + 主要 20 URL の手動インデックス申請**(Phase 1 完了後)。

### Phase 1 完了条件
- `next build` が成功し本番デプロイ済み。
- GSC で sitemap 提出ステータス OK。
- GA4 で実 MAU 計測ビューが安定。

---

## Phase 2 — Week 3-4: ページ品質と内部リンク強化

期待リフト累計: **MAU 200〜300**。インデックス波 + エンゲージメント改善。

### 実装タスク

1. **JSON-LD 構造化データ**(専用コンポーネント不要、各ページ RSC 内で `<script type="application/ld+json">` をインライン)
   - `app/[lang]/layout.tsx`: `Organization` + `WebSite`(`SearchAction` で `/companies?q={query}` を指定 → サイトリンク検索ボックスの可能性)
   - `app/[lang]/companies/[id]/page.tsx`: `Corporation`(name, url, address from `headOfficeLocation`, numberOfEmployees) + `BreadcrumbList`
   - `app/[lang]/industries/[id]/page.tsx` & `markets/[id]/page.tsx`: `ItemList`(上位 20 社) + `BreadcrumbList` + `CollectionPage`
   - **`Dataset` schema は defer**(Google Dataset Search はニッチで割に合わない)

2. **リストページの ISR 化**
   - `app/[lang]/companies/page.tsx`, `industries/[id]/page.tsx`, `markets/[id]/page.tsx` に `export const revalidate = 3600` を追加。
   - 詳細ページは既に `generateStaticParams` で SSG 済み(`app/[lang]/companies/[id]/page.tsx:310-330`)。

3. **OGP 動的画像** (`next/og` の `ImageResponse` を使用)
   - `app/[lang]/companies/[id]/opengraph-image.tsx`(企業名・証券コード・売上・業界タグの 1200×630 カード)
   - `app/[lang]/industries/[id]/opengraph-image.tsx`(業界名 + 上位 3 社)
   - `app/[lang]/markets/[id]/opengraph-image.tsx`(市場名 + 上位 3 社)
   - トップ・companies リスト用は静的 PNG を `typescript/public/og/` に配置し `openGraph.images` で参照。

4. **「関連企業」セクションを企業詳細ページに追加**
   - `app/[lang]/companies/[id]/page.tsx` 下部に 2 リスト: 同業界の売上 TOP5 + 同市場の売上 TOP5。
   - `listCompanies({ industryId })` / `listCompanies({ marketId })` を再利用。
   - 効果: 1 ページあたりの内部リンク +10 → クロール深度向上 + 滞在時間 13s → 30s+ を狙う。

5. **業界/市場ページに sortType タブを実装**
   - 現状ほぼ `net_sales` 一択。タブ(サーバーサイド `<Link>` ナビ)で `net_sales` / `average_annual_salary` / `operating_income` / `equity_to_asset_ratio` を切替。
   - 各タブ URL で `<title>` 差別化(例: 「{industry} 平均年収ランキング」)。
   - **インデックス対象 URL が ~4 倍**になる(ほぼ追加コードゼロで)。
   - sitemap.ts にも追加。

6. **シェアボタン** — 軽量コンポーネント `typescript/components/ShareButtons.tsx`
   - X/Twitter intent URL + はてブ(`https://b.hatena.ne.jp/entry/...`)を企業詳細ページに配置。
   - はてブはホットエントリ入りすると 100+ MAU を一気に呼べる。

---

## Phase 3 — Week 5-8: 検索意図特化のコンテンツハブ

期待リフト累計: **MAU 400〜600**。ハブページのランキング反映は通常 4-6 週かかるため大半は Phase 4 で開花。

### 実装タスク

1. **ランキングハブルート** `typescript/app/[lang]/rankings/[slug]/page.tsx` 新規作成
   - スラッグ→クエリ設定の小さな静的マップ(sortType, optional industry/market filter, ロケール別 H1 + 導入文)。
   - 初期 20-30 スラッグ:
     - `nensyu` (日本企業 平均年収ランキング, sort=`average_annual_salary`)
     - `uriage` (売上高ランキング, sort=`net_sales`)
     - `eigyou-rieki` (営業利益ランキング)
     - `roe` (ROE ランキング)
     - 業界横断クロス: `nensyu/jouhou-tsushin`, `nensyu/ginkougyou` 等(主要 10 業界 × 2 指標 = 20 ページ)
   - `generateStaticParams` でスラッグ配列をビルド時展開、`export const revalidate = 86400`。
   - 各ページに **800 字以上のユニークなコメンタリ**(データから自動生成: 「1 位は{companyName}の{value}円。前年比{diff}%」等) + H2 セクション + ランキングテーブル + パンくず + JSON-LD `ItemList` + 詳細ページへの 5+ リンク。
   - 全ハブ URL を sitemap.ts に追加。

2. **比較ページ** `typescript/app/[lang]/compare/[idA]/[idB]/page.tsx`
   - 2 社の財務指標を横並び表示。
   - `generateStaticParams` は **全ペアの組合せ**ではなく上位 200 ペア(同業界・近似サイズ)のみ事前生成。残りは `dynamicParams: true, revalidate: 86400` で on-demand ISR。
   - 「{A} {B} 比較 年収」系の低競合クエリを取りに行く。

3. **トップページ強化** `typescript/app/[lang]/page.tsx`
   - 現状はカテゴリディレクトリのみ → ファーストビューに以下を追加:
     - 売上 TOP10 ミニテーブル(詳細リンク付き)
     - 「今日の発見」(自動生成ファクトイド: 「最も平均年収が高い企業は{name}の{salary}万円」)
     - ランキングハブ 3 件のティーザー
   - 既存の markets/industries グリッドは下に移動。

4. **被リンク獲得活動**(並行、週 5-8)
   - **Hatenablog** (`yuki0920.hatenablog.jp`) で週 2 本長文記事を執筆。新ランキングページを参照リンクに(例: 「EDINET から集計した 日本企業年収ランキング 2026 最新版」→ `/ja/rankings/nensyu`)。
   - **Qiita または Zenn** に技術記事 1 本: 「EDINET スクレイピング+Next.js 15 App Router+ISR で作る企業ランキングサイト」 → GitHub リポと本サイトに被リンク。
   - **X/Twitter** で OGP カード活用 (週 2-3 投稿): 「本日の発見: {company} の ROE は {value}% で {industry} 業界 1 位」。

---

## Phase 4 — Week 9-12: 複利化と CTR 最適化

期待リフト累計: **MAU 900〜1300**(目標達成圏)。

### 実装タスク

1. **CTR 最適化(GSC データ駆動)**
   - 週 9 から GSC で「impressions あり / CTR 低」のクエリを抽出。
   - 該当ページの `generateMetadata` で `<title>` / `description` を書き直し: 年(2026)・件数(「3000 社中」)・「最新版」フックを含める。
   - 週次でイテレート。

2. **ランキングハブ拡張: 80-100 スラッグ**
   - 業界別年収・利益率・YoY 成長率(`lastYearNetSales` vs `netSales`)等。Phase 3 と同パターンで限界費用低。

3. **業界深掘りページ** `typescript/app/[lang]/industries/[id]/overview/page.tsx`
   - 1500 字以上のコメンタリ + 主要プレイヤー + 市場サマリー + 埋込ミニランキング。
   - 「{業界名} 業界 企業」のヘッドターム狙い。

4. **Hatenablog 継続(週 2 本)**+ 他の日本語 finance/career ブログへ outreach で 3-5 被リンク獲得。

5. **パフォーマンス最終調整**
   - Top 5 ページに Lighthouse 実行。`x-nextjs-cache: HIT` ヘッダで ISR 動作確認。
   - mobile <80 のページがあれば修正(モバイル順位への影響大)。

6. **必要なら sitemap index 化**(`generateSitemaps` API)
   - URL が 10k 超えたら `sitemap-companies.xml` / `sitemap-rankings.xml` 等に分割。

---

## 修正・新規作成ファイル一覧

### 新規
- `typescript/app/sitemap.ts`
- `typescript/app/robots.ts`
- `typescript/app/[lang]/companies/[id]/opengraph-image.tsx`
- `typescript/app/[lang]/industries/[id]/opengraph-image.tsx`
- `typescript/app/[lang]/markets/[id]/opengraph-image.tsx`
- `typescript/components/ShareButtons.tsx`
- `typescript/app/[lang]/rankings/[slug]/page.tsx`
- `typescript/app/[lang]/compare/[idA]/[idB]/page.tsx`
- `typescript/app/[lang]/industries/[id]/overview/page.tsx`
- `typescript/public/og/default-ja.png`, `default-en.png`

### 修正
- `typescript/app/[lang]/layout.tsx` (og:locale 動的化、hreflang、JSON-LD `Organization`+`WebSite`)
- `typescript/app/[lang]/companies/[id]/page.tsx` (canonical+hreflang、JSON-LD `Corporation`+`BreadcrumbList`、関連企業セクション)
- `typescript/app/[lang]/companies/page.tsx` (canonical+hreflang、ISR)
- `typescript/app/[lang]/industries/[id]/page.tsx` (canonical+hreflang、JSON-LD、ISR、sortType タブ)
- `typescript/app/[lang]/markets/[id]/page.tsx` (canonical+hreflang、JSON-LD、ISR、sortType タブ)
- `typescript/app/[lang]/page.tsx` (TOP10・ファクトイド・ハブティーザー追加)

### 再利用する既存ユーティリティ
- `typescript/hooks/GetData.ts` の `listSecurityCodes` / `listCompanies` / `listIndustries` / `listMarkets` / `getCompany`
- `typescript/hooks/GetDictionary.ts` (i18n)
- `typescript/dictionaries/i18n-config.ts`
- `typescript/components/BreadCrumbs.tsx` (パンくず UI)
- `typescript/components/GoogleAnalytics.tsx` (既設置、変更不要)

---

## リスクと緩和策

1. **ランキングハブが順位付かない最大リスク**(プログラム生成 = doorway page 認定の可能性)
   - 緩和: 各ハブに **データ表の上に固有のコメンタリ + 内外部リンク** を必ず置く。
   - Week 8 までに 0 ハブが順位付かなければ、Phase 4 は **Hatenablog 中心戦略にピボット**(本サイトは引用先に徹する)。
2. **EDINET データ鮮度認識**: 「データ更新日: {date}」バッジ + 会計年度を H1 近くに明示。
3. **Bot トラフィック再流入**: 週 2 で GA4 を確認し Singapore/China Direct が >50% に戻れば、Vercel Edge Middleware で既知 bot UA をブロック(GA pageview リクエストを除外する transport_url 仕様で)。地域 IP ブロックは VPN 利用者を排除するため避ける。
4. **1 人運用の帯域**: 約 15h/週の見積。不足時は (i) 比較ページ → (ii) EN 改善 → (iii) OGP 動的画像 → の順で削る。
5. **GSC のインデックスサンプリング上限**(~1000 URL): 業界・市場・ハブを優先発見させるためトップから内部リンクを張る。

---

## 検証方法 (各 Phase 終了後の Verification)

### Phase 1 終了後
- `cd typescript && npm run build` が成功し、`.next/server/app/sitemap.xml` が生成される。
- `curl https://www.company-ranking.net/sitemap.xml` で URL リストが返る。`/robots.txt` も同様。
- 主要ページの `<head>` を curl で取得し `<link rel="alternate" hreflang="ja-JP">` と `<link rel="canonical">` の値が正しいことを確認。
- GSC で sitemap が「成功」ステータス、GA4 で実 MAU ビューが機能。

### Phase 2 終了後
- 企業詳細ページのソースに `<script type="application/ld+json">` が出力され、Google [Rich Results Test](https://search.google.com/test/rich-results) で `Corporation` schema が検出される。
- 企業詳細 URL を Twitter/X / Slack に貼り、OGP カード(動的画像)が表示される。
- `curl -I https://.../ja/companies?sortType=net_sales` で `x-nextjs-cache: HIT` (2回目以降)。
- GA4 で平均セッション継続時間が **>25 秒** に改善している。

### Phase 3 終了後
- `/ja/rankings/nensyu` が直接アクセスで 200 を返し、Lighthouse SEO スコア >95。
- GSC で 30+ ハブページが Indexed。少なくとも 5 ハブが GSC 上位 30 位以内に impression を取り始めている。
- GA4 referral から `hatenablog.jp` ドメインのトラフィックが見える(目標 50+/月)。
- 累計 MAU 400-600。

### Phase 4 終了後 (最終目標)
- **GA4 「Engaged Users 28d」 >1000**(本目標)
- GSC: 100+ ページ Indexed、50+ クエリで TOP10。
- 平均セッション継続時間 >40 秒、ページ/セッション >2.5。
- Hatenablog 経由 referral >100/月。

---

## 進捗 KPI ダッシュボード(週次レビュー推奨)

| 週 | 実 MAU 目標 | GSC Indexed | Hatenablog 累計記事 | 主要マイルストーン |
|---|---|---|---|---|
| 2 | 100-130 | 500+ | 0 | sitemap 提出完了, GA4 hygiene 完了 |
| 4 | 200-300 | 2000+ | 2 | JSON-LD + ISR + OGP + 関連企業セクション |
| 8 | 400-600 | 3000+ | 8 | ハブ 30 ページ稼働、Qiita/Zenn 投稿 |
| 12 | **1000+** | 4000+ | 16+ | CTR 最適化済、業界 overview ページ稼働 |
