# Feature Specification: MAU 1000 達成ロードマップ

**Feature Branch**: `001-mau-1000-roadmap`
**Created**: 2026-05-11
**Status**: Draft
**Input**: User description: "@docs/mau-1000-roadmap.md に記載があるが、MAU1000を目指している。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 検索エンジン経由でランキングページに到達する (Priority: P1)

日本の求職者・投資家・就活生が Google で「企業 年収 ランキング」「{業界名} 売上 ランキング」などのクエリを検索した際、company-ranking.net の該当ページが検索結果に表示され、クリックして欲しい情報(企業ランキング・財務指標・年収比較)に最短で到達できる。

**Why this priority**: 唯一実績のある成長チャネルが Organic Search であり、サイトには SEO 基盤(sitemap / robots / 構造化データ / hreflang)が一切ないため、ここを整備することが MAU 拡大の最大レバーである。SEO 基盤がなければ後続施策(ハブページ・コンテンツ拡充)の効果も発揮されない。

**Independent Test**: Google Search Console で sitemap が「成功」ステータスとして登録され、主要 URL が Indexed 状態で、クエリ「{企業名} 年収」「{業界} ランキング」で 30 位以内に表示されることを確認することでテスト可能。これだけで実質ユーザー約 100 → 200-300 への成長が見込める。

**Acceptance Scenarios**:

1. **Given** ユーザーが Google で「日本企業 平均年収 ランキング」と検索する, **When** 検索結果ページを表示する, **Then** company-ranking.net の年収ランキングページが結果に含まれる
2. **Given** ユーザーが企業詳細ページを SNS にシェアする, **When** リンクが展開される, **Then** 企業名・売上・業界が表示された OGP カードが表示される
3. **Given** クローラーが sitemap.xml にアクセスする, **When** XML を取得する, **Then** ~6,000 件の企業・業界・市場 URL が言語別に列挙され、各エントリに hreflang が付与されている
4. **Given** 日本語ページが Google にインデックスされる, **When** 検索結果に表示される, **Then** og:locale が `ja_JP` として認識され、英語ページとは別 URL として扱われる

---

### User Story 2 - ランキングページから関連ページを回遊する (Priority: P2)

ユーザーが企業詳細ページに到達した後、同業界の競合企業や同市場の他社、年収比較ページなどに自然に遷移し、複数のページを閲覧することでサイト全体の価値を体験できる。

**Why this priority**: P1 で集客した訪問者をすぐに離脱させない仕組みが MAU 維持に必要。現状の平均セッション継続時間 13 秒は短すぎ、Google にも「ユーザーが満足していないサイト」と認識される。内部リンクと構造化データはクロール深度・滞在時間を同時に改善する。

**Independent Test**: 企業詳細ページから「関連企業」セクションへのクリック率、平均セッション継続時間が 25 秒以上、ページ/セッションが 2.0 以上になることを GA4 で確認することでテスト可能。

**Acceptance Scenarios**:

1. **Given** ユーザーが企業 A の詳細ページを開く, **When** ページ下部までスクロールする, **Then** 同業界 TOP5 と同市場 TOP5 の企業リンクが表示される
2. **Given** ユーザーが業界ページを開く, **When** 並び順タブをクリックする, **Then** 売上・平均年収・営業利益・自己資本比率の 4 種類で再ソートされた URL に遷移する
3. **Given** Google Rich Results Test で企業詳細 URL を検証する, **When** 結果が返る, **Then** `Corporation` schema と `BreadcrumbList` が検出される
4. **Given** ユーザーが企業詳細ページの X シェアボタンを押す, **When** Twitter intent が開く, **Then** 企業名・カノニカル URL を含むツイート下書きが生成される

---

### User Story 3 - 検索意図特化のハブページに直接ランディングする (Priority: P3)

「年収ランキング」「ROE ランキング」「{業界} 平均年収」など、ロングテールの検索意図に対応する専用ハブページが存在し、ユーザーがそこで欲しい情報のサマリ・解説・上位企業リンクを一気に得られる。

**Why this priority**: 個別企業ページだけでは取りきれない「ランキング系」「比較系」クエリを獲得するには専用のハブが必要。インデックス反映に 4-6 週かかるため、P1/P2 の後で投入してフェーズ後半の成長を担う。

**Independent Test**: 30+ ハブページが Google Search Console で Indexed となり、5+ ハブが TOP30 内に impressions を獲得することを確認することでテスト可能。

**Acceptance Scenarios**:

1. **Given** ユーザーが `/ja/rankings/nensyu` に直接アクセスする, **When** ページを表示する, **Then** 平均年収 TOP の上位企業リスト・固有のコメンタリ(800 字以上)・パンくず・関連リンクが表示される
2. **Given** ユーザーが 2 社比較ページにアクセスする, **When** `/ja/compare/{idA}/{idB}` を開く, **Then** 両社の財務指標が横並びで表示される
3. **Given** ハブページを Lighthouse で計測する, **When** SEO カテゴリのスコアを取得する, **Then** スコアが 95 以上

---

### User Story 4 - 外部メディアからの被リンク・流入を獲得する (Priority: P3)

技術ブログ(Hatenablog / Qiita / Zenn)や X からの参照リンク・OGP 共有を通じて、検索以外のチャネルから新規ユーザーがサイトに流入する。

**Why this priority**: Organic Search 単独では成長スピードに上限があるため、複利的に効く被リンク・SNS 経由流入を並行して育てる必要がある。ただしコンテンツ生産にコストがかかるため P3。

**Independent Test**: GA4 Referral レポートで Hatenablog ドメインからの月間訪問が 50+ であること、被リンクを獲得した URL が GSC の被リンクレポートに反映されていることを確認することでテスト可能。

**Acceptance Scenarios**:

1. **Given** Hatenablog 記事内のリンクをユーザーがクリックする, **When** company-ranking.net に着地する, **Then** GA4 で `hatenablog.jp` が Referral source として記録される
2. **Given** X で企業詳細 URL を投稿する, **When** タイムラインに表示される, **Then** 動的生成された OGP カード(企業名・証券コード・売上・業界)が展開表示される

---

### Edge Cases

- **Bot トラフィック流入**: GA4 で Singapore / China などの engagement rate 0% トラフィックが再度急増した場合、MAU 数値が水増しされて実態が見えなくなる。対策として実 MAU 計測ビュー(engagement rate > 0 かつ avg session duration > 5s)を北極星指標として使用する。
- **doorway page 認定リスク**: 自動生成のハブページが Google から「中身のないテンプレページ」と判定されると検索順位が付かない。各ハブには 800 字以上の固有コメンタリ・データ表・内外部リンクを必ず配置する。
- **インデックス未反映**: sitemap 提出後も Google が URL を発見しないケース。トップから業界・市場・ハブへの内部リンクを必ず張り、主要 20 URL は手動インデックス申請を行う。
- **データ鮮度の誤認**: EDINET 由来のデータは過去会計年度のため、ユーザーが「最新ではない」と離脱する可能性。各ページに「データ更新日」と「対象会計年度」を明示する。
- **モバイル性能不足**: モバイル Lighthouse スコアが 80 未満のページがあると Google の Core Web Vitals 評価で不利になる。Top 5 ページは定期計測する。
- **GSC インデックスサンプリング上限**: 一般的に ~1000 URL のサンプリングしか反映されないため、優先発見させたい URL は内部リンクで強調する。
- **VPN ユーザーの誤排除**: 地域単位での bot 除外を行うと VPN 経由の実ユーザーまで除外される。地域ベースではなく engagement ベースでフィルタする。

## Requirements *(mandatory)*

### Functional Requirements

#### SEO 基盤 (Phase 1)

- **FR-001**: System MUST 全公開ページの URL を網羅した sitemap を自動生成して `/sitemap.xml` で公開する(静的ページ + 全企業 + 全業界 + 全市場、両ロケール分)
- **FR-002**: System MUST `/robots.txt` を公開し、クロール対象を許可しつつクエリ文字列パターン(`?q=*`, `?sortType=*`)はクロール対象から除外する
- **FR-003**: System MUST 各 URL の `<head>` に正しい言語の `og:locale`(日本語 → `ja_JP`、英語 → `en_US`)を出力する
- **FR-004**: System MUST 各ページの `<head>` に canonical URL と、対応する別言語ページへの `hreflang` リンクを出力する(対象: 企業詳細・企業リスト・業界詳細・市場詳細)
- **FR-005**: System MUST sitemap を Google Search Console に提出し、提出ステータスが「成功」になる
- **FR-006**: System MUST 実 MAU を計測するための GA4 ビュー(engagement rate > 0 かつ avg session duration > 5s)を提供する
- **FR-007**: System MUST GA4 で内部トラフィック・開発者トラフィックを除外する設定を有効化する

#### ページ品質と内部リンク (Phase 2)

- **FR-008**: System MUST 全ページの `<head>` 内に JSON-LD 構造化データを出力する(レイアウト: `Organization` + `WebSite`、企業詳細: `Corporation` + `BreadcrumbList`、業界・市場: `ItemList` + `BreadcrumbList` + `CollectionPage`)
- **FR-009**: System MUST 企業リスト・業界詳細・市場詳細ページを ISR(1 時間間隔の再生成)でキャッシュ配信する
- **FR-010**: System MUST 企業詳細・業界詳細・市場詳細の OGP 用画像を動的生成し、企業名・主要指標・業界タグなどを 1200×630 で含める
- **FR-011**: System MUST 企業詳細ページの下部に「同業界の売上 TOP5」「同市場の売上 TOP5」の関連企業リンクセクションを表示する
- **FR-012**: System MUST 業界・市場ページに並び順タブ(売上 / 平均年収 / 営業利益 / 自己資本比率)を提供し、それぞれを別 URL として sitemap に含める
- **FR-013**: System MUST 並び順タブ URL の `<title>` に並び順を含めて差別化する(例: 「{業界名} 平均年収ランキング」)
- **FR-014**: System MUST 企業詳細ページに X / はてなブックマークへのシェアボタンを設置する

#### コンテンツハブ (Phase 3)

- **FR-015**: System MUST ランキングハブルート `/{lang}/rankings/{slug}` を提供し、初期 20-30 スラッグ(年収 / 売上 / 営業利益 / ROE および 業界横断クロス)をサポートする
- **FR-016**: Each ranking hub page MUST 800 文字以上のユニークなコメンタリ(データ駆動で自動生成可)・H2 セクション・ランキングテーブル・パンくず・JSON-LD `ItemList`・詳細ページへの 5 件以上のリンクを含む
- **FR-017**: System MUST 2 社の財務指標を比較する `/{lang}/compare/{idA}/{idB}` ページを提供する。上位 200 ペアを事前生成し、それ以外は on-demand ISR で配信する
- **FR-018**: System MUST トップページのファーストビューに「売上 TOP10 ミニテーブル」「今日の発見ファクトイド」「ランキングハブ 3 件のティーザー」を含める
- **FR-019**: System MUST 全ランキングハブ URL を sitemap に含める

#### 外部発信 (Phase 3-4 並行)

- **FR-020**: Operator MUST Hatenablog で週 2 本ペースの長文記事を継続的に投稿し、ランキングページへの被リンクを獲得する
- **FR-021**: Operator MUST Qiita または Zenn に技術記事を 1 本以上投稿し、本サイトへの被リンクを獲得する
- **FR-022**: Operator MUST X で週 2-3 投稿の頻度で OGP カードを活用した発信を継続する

#### 複利化と最適化 (Phase 4)

- **FR-023**: Operator MUST GSC の「impressions あり / CTR 低」クエリを週次で抽出し、該当ページの `<title>` / `description` を最適化する(2026 などの年号・「3000 社中」などの規模表記・「最新版」フックを含める)
- **FR-024**: System MUST ランキングハブを 80-100 スラッグまで拡張する(業界別年収 / 利益率 / YoY 成長率)
- **FR-025**: System MUST 業界深掘りページ `/{lang}/industries/{id}/overview` を提供し、1500 文字以上のコメンタリ + 主要プレイヤー + 埋込ミニランキングを含める
- **FR-026**: System MUST URL 数が 10,000 を超えた場合、sitemap を `sitemap-companies.xml` / `sitemap-rankings.xml` 等に分割した sitemap index 形式に切り替える
- **FR-027**: Top 5 ページの Lighthouse モバイルスコアが 80 を超えていなければならない

### Key Entities *(include if feature involves data)*

- **企業 (Company)**: 約 3,000 上場企業。証券コード・名称・業界 ID・市場 ID・所在地・従業員数・売上 (`netSales`)・前期売上 (`lastYearNetSales`)・営業利益 (`operatingIncome`)・平均年収 (`averageAnnualSalary`)・自己資本比率 (`equityToAssetRatio`)・ROE などを持つ。企業詳細ページ・OGP 画像・関連企業セクションのデータ源。
- **業界 (Industry)**: 33 業界。企業を分類し、ランキング・並び順タブ・ハブページの軸となる。両ロケールで名称を持つ。
- **市場 (Market)**: 上場市場分類。企業の所属市場で、ランキング・関連企業セクションの軸の 1 つ。
- **ランキングハブ (Ranking Hub)**: スラッグ・並び順指標・任意の業界/市場フィルタ・ロケール別 H1・導入文を持つ静的に定義された URL 単位。初期 20-30 件→拡張 80-100 件。
- **GA4 イベント / ビュー**: 実 MAU 計測ビュー(`Engagement rate > 0` ∧ `Avg session duration > 5s`)、「Engaged Users 28d」オーディエンスが北極星指標として機能する。
- **Search Console プロパティ**: ドメインプロパティ `https://www.company-ranking.net/`。sitemap 提出・インデックス状態・クエリパフォーマンスの観測点。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 実 MAU(GA4「Engaged Users 28d」、engagement rate > 0 かつ avg session duration > 5s フィルタ適用)が 12 週間以内に **1,000 を超える**
- **SC-002**: 平均セッション継続時間が 12 週間以内に **40 秒以上**(現状 13 秒)になる
- **SC-003**: 1 セッションあたりのページビュー数が 12 週間以内に **2.5 以上**になる
- **SC-004**: 12 週間以内に Google Search Console 上で **4,000 以上の URL が Indexed** となり、50 件以上のクエリで TOP10 順位を獲得する
- **SC-005**: Hatenablog 経由の月間 Referral 訪問が 12 週間以内に **100 以上**になる
- **SC-006**: Phase 1 完了(2 週時点)で sitemap 提出ステータスが「成功」、500 以上の URL が Indexed されている
- **SC-007**: Phase 2 完了(4 週時点)で実 MAU が **200-300**、企業詳細ページの Google Rich Results Test で `Corporation` スキーマが検出される
- **SC-008**: Phase 3 完了(8 週時点)で 30+ ハブページが Indexed、5+ ハブが GSC TOP30 内に impression を獲得、累計実 MAU が **400-600**
- **SC-009**: 全主要ページの Lighthouse SEO スコアが **95 以上**、モバイル Performance スコアが **80 以上**
- **SC-010**: Bot トラフィック(engagement rate 0% / avg session duration 0s)の割合が全セッションの **30% 未満**に維持される

## Assumptions

- 計測対象は GA4 の「実 MAU 計測ビュー」(engagement rate > 0 かつ avg session duration > 5s)で算出する値であり、GA4 デフォルトの 28 日アクティブユーザー数ではない。1000 という目標値は実ユーザー基準。
- 主要ターゲットは日本語ユーザー。英語ページは技術的な SEO 基盤(sitemap / hreflang / canonical)のみ整備し、コンテンツ拡張やハブ展開は対象外。MAU 1000 の内訳は日本語 ~950 / 英語 ~50 を想定。
- 有料広告(Google Ads / Meta Ads など)は使用しない。集客は Organic Search + Referral + Direct + SNS のオーガニックチャネルに限定する。
- 運用工数の目安は **1 人 × 約 15 時間 / 週**。不足時の削減優先順位は (i) 比較ページ → (ii) EN 改善 → (iii) OGP 動的画像。
- データ源は既存の Postgres(EDINET スクレイピング・JPX スクレイピング由来)を継続利用。新規データ取得・新規外部 API 連携は本計画には含まれない。
- 既存の Next.js 15 App Router / Go API / Ruby バッチ構成は変更しない(`go/**/*.gen.go`, `go/models/*.xo.go`, `typescript/client/**` は生成物のため触らない)。
- 構造化データ・OGP 画像の生成は Next.js 標準機能(Metadata API / `next/og` の `ImageResponse`)で完結する。
- ハブページのコメンタリは既存データからのテンプレート生成で 800 字以上を確保できる(主観評論ではなく数値ベースの記述)。
- Bot 除外の対応は GA4 内のフィルタおよびレポート定義で行う。サーバ側で IP ブロック・UA ブロックを行うのは Singapore / China Direct が再び全セッションの 50% を超えた場合のみ。
- GSC ドメインプロパティの管理権限はオペレーターが所有しており、sitemap 提出・インデックス申請・データ取得が可能。
