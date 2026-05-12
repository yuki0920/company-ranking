# Quickstart: MAU 1000 達成ロードマップ

**Feature**: 001-mau-1000-roadmap
**Purpose**: 各 Phase の完了確認手順と、繰り返し実行する検証コマンドをワンストップで提供する。

---

## 前提

```bash
# リポジトリルートで
cp .env_sample .env && cp .envrc_sample .envrc
docker compose build
make go/install/tools
cd typescript && npm install && cd -
```

PR レビュー前のローカルゲート(Constitution IV):

```bash
make typescript/lint
docker compose run --rm typescript npm run build
```

---

## Phase 0(Day 1): GA4 / GSC 整備(オペレーター手作業)

コードを書く前に **必ず**完了させる(これがないと以後の効果測定が成立しない)。

### GA4 設定

1. Admin → Data Streams → Configure tag settings → Define internal traffic
   - 自宅 / 職場の IPv4 を `internal` ラベルで登録
2. Admin → Data Settings → Data Filters
   - "Internal Traffic" を **Active**(Exclude)に切替
   - "Developer traffic" を **Active**(Exclude)に切替
3. 探索 → 「実 MAU 計測 Comparison」を作成
   - 条件: `engagement rate > 0` AND `average session duration > 5s`
   - **国・地域では除外しない**(VPN 実ユーザーまで除外してしまうため)
4. Admin → Audiences → "Engaged Users 28d" を作成
   - 条件: 上記コンディションを 28 日ウィンドウで集計

### GSC 設定

1. ドメインプロパティ `https://www.company-ranking.net/` を登録(URL prefix property ではない)
2. 所有権確認後、sitemap 提出は Phase 1 完了後

### 完了判定

- GA4 ヘッダで「Comparison: 実 MAU 計測」が選べる
- GSC で本ドメインプロパティが Verified

---

## Phase 1(Week 1–2): SEO 基盤(コード変更)

### 完了判定コマンド

```bash
# ローカルビルドが成功し sitemap が生成される
docker compose run --rm typescript npm run build
ls typescript/.next/server/app/sitemap.xml typescript/.next/server/app/robots.txt

# 本番デプロイ後
curl -I https://www.company-ranking.net/sitemap.xml         # 200 OK
curl -I https://www.company-ranking.net/robots.txt          # 200 OK
curl -s https://www.company-ranking.net/sitemap.xml | grep -c "<loc>"    # ~7,000

# 主要ページの <head>
curl -s https://www.company-ranking.net/ja/companies/{ID} | grep -E '(rel="canonical"|hreflang|og:locale)'
# 期待: canonical=/ja/companies/{ID}、hreflang ja-JP / en-US 各 1、og:locale=ja_JP

# 削除済み企業(存在しない ID)
curl -I -o /dev/null -s -w "%{http_code}\n" https://www.company-ranking.net/ja/companies/9999999
# 期待: 404(soft-404 不可)
```

### GSC 操作

1. Search Console → Sitemaps → `sitemap.xml` を提出
2. ステータスが「成功」になることを確認(数時間〜数日)
3. URL Inspection → 主要 20 URL(トップ × 2、companies × 2、主要業界 × 5、主要企業 × 11)を手動インデックス申請

### 完了基準(SC-006)

- [ ] sitemap 提出ステータス「成功」
- [ ] GSC Indexed URLs ≥ 500
- [ ] 主要ページの canonical / hreflang / og:locale が正しい

---

## Phase 2(Week 3–4): ページ品質強化

### 完了判定コマンド

```bash
# JSON-LD が出力されている
curl -s https://www.company-ranking.net/ja/companies/{ID} | grep -A1 'application/ld+json'
# 期待: Corporation + BreadcrumbList の 2 ブロック

# Rich Results Test(手動)
# https://search.google.com/test/rich-results?url=https://www.company-ranking.net/ja/companies/{ID}
# 期待: Corporation schema 検出

# 並び順 path-tab(FR-012)
curl -I https://www.company-ranking.net/ja/industries/{ID}/salary    # 200 OK
curl -s https://www.company-ranking.net/ja/industries/{ID}/salary | grep -E '<title>|canonical'
# 期待: title に「平均年収」、canonical=self

# 関連企業セクション
curl -s https://www.company-ranking.net/ja/companies/{ID} | grep -c '/ja/companies/'
# 期待: 自分 + 関連 10 件以上

# OGP 動的画像
curl -I https://www.company-ranking.net/ja/companies/{ID}/opengraph-image    # 200 OK image/png

# データ更新日バッジ(FR-014a)
curl -s https://www.company-ranking.net/ja/companies/{ID} | grep -E 'FY[0-9]{4}|更新日'

# ISR キャッシュ動作
curl -I https://www.company-ranking.net/ja/companies?sortType=net_sales
curl -I https://www.company-ranking.net/ja/companies?sortType=net_sales    # 2 回目
# 期待: x-nextjs-cache: HIT(2 回目)
```

### GA4 確認

- 平均セッション継続時間 ≥ 25s(SC-002 への中間チェック)
- ページ/セッション ≥ 1.5

### 完了基準(SC-007)

- [ ] 全主要ページに JSON-LD 出力
- [ ] Rich Results Test で Corporation schema 検出
- [ ] 並び順タブ 4 種が path-segment URL で動作
- [ ] 動的 OGP 画像が返る
- [ ] 関連企業セクションが企業詳細ページ下部に表示
- [ ] データ更新日バッジが表示
- [ ] 実 MAU 200–300

---

## Phase 3(Week 5–8): コンテンツハブ

### 完了判定コマンド

```bash
# 全ハブ slug が 200 を返す
for slug in nensyu uriage eigyou-rieki roe; do
  echo "$slug: $(curl -I -s -o /dev/null -w '%{http_code}' https://www.company-ranking.net/ja/rankings/$slug)"
done

# Lighthouse(モバイル)
npx lighthouse https://www.company-ranking.net/ja/rankings/nensyu \
  --only-categories=seo,performance --form-factor=mobile --output=json | jq '.categories | { seo: .seo.score, perf: .performance.score }'
# 期待: seo ≥ 0.95, perf ≥ 0.80

# ハブ固有の数値文(FR-016 anti-thin-content)
curl -s https://www.company-ranking.net/ja/rankings/nensyu | grep -oE '[0-9,]{3,}円' | head -10
# 期待: 数値固有文が複数(最低 3 個)

# 比較ページ(prebuilt)
curl -I https://www.company-ranking.net/ja/compare/{idA}/{idB}
# 期待: 200 OK + 2 社の財務指標

# トップページ強化
curl -s https://www.company-ranking.net/ja | grep -E 'TOP10|今日の発見|rankings/'
```

### GSC 確認

- 30+ ハブページが Indexed
- 5+ ハブが TOP30 内に impressions
- Hatenablog referral ≥ 50/月(GA4)

### 完了基準(SC-008)

- [ ] 20–30 ランキングハブ稼働、全 200 OK
- [ ] Lighthouse SEO ≥ 95 / Perf ≥ 80
- [ ] 上位 200 ペアの比較ページ事前生成
- [ ] トップページに TOP10 + ファクトイド + ハブティーザー
- [ ] 実 MAU 400–600

---

## Phase 4(Week 9–12): 最適化 / 複利化

### 完了判定コマンド

```bash
# Core Web Vitals(SC-009)
npx lighthouse https://www.company-ranking.net/ja --form-factor=mobile --output=json | \
  jq '.audits | { lcp: ."largest-contentful-paint".numericValue, cls: ."cumulative-layout-shift".numericValue, inp: ."interaction-to-next-paint".numericValue }'
# 期待: lcp ≤ 2500ms, cls ≤ 0.1, inp ≤ 200ms

# ハブ拡張
curl -s https://www.company-ranking.net/sitemap.xml | grep -c '/rankings/'
# 期待: 80 以上

# 業界 overview
curl -I https://www.company-ranking.net/ja/industries/{ID}/overview

# sitemap index(URL 数 > 10,000 のとき)
curl -s https://www.company-ranking.net/sitemap.xml | grep -c sitemapindex
```

### 完了基準(最終 SC-001 など)

- [ ] **実 MAU(GA4 Engaged Users 28d)≥ 1,000**(本目標)
- [ ] GSC Indexed ≥ 4,000、TOP10 クエリ ≥ 50
- [ ] 平均セッション継続時間 ≥ 40s
- [ ] ページ/セッション ≥ 2.5
- [ ] Hatenablog referral ≥ 100/月
- [ ] Top 5 ページの Lighthouse mobile ≥ 80 / SEO ≥ 95
- [ ] LCP ≤ 2.5s / INP ≤ 200ms / CLS ≤ 0.1
- [ ] Bot トラフィック割合 < 30%

---

## 共通: PR チェックリスト(Constitution IV)

すべての PR で以下を本文に明記:

- 影響範囲: TypeScript フロントエンドのみ(Go / Ruby / OpenAPI 変更なしを明示)
- 実行ゲート: `make typescript/lint` 通過 / `npm run build` 通過
- 手動確認ページ: 該当ページの URL を箇条書き(`/ja/companies/{ID}`、`/ja/industries/{ID}/salary` など)
- 期待差分: Lighthouse 主要スコアの before/after が劣化していないこと

---

## トラブルシュート

| 症状 | 確認 | 対処 |
|------|------|------|
| sitemap が空 | `listSecurityCodes()` 戻り値 | Go API への通信を確認、`NEXT_PUBLIC_API_URL` 確認 |
| 企業詳細が 200 で空 HTML | RSC が `notFound()` を呼べていない | `getCompany` の Promise 解決を確認、`if (!company) notFound()` を追加 |
| canonical が `localhost` | `metadataBase` が `process.env` を読んでいない | 本番ビルド時の `NEXT_PUBLIC_SITE_URL` を確認 |
| OGP 画像が文字化け | フォント未バンドル | `next/font/local` で日本語フォントを同梱 |
| CLS が悪化 | 関連企業セクションを遅延挿入していないか | SSR 初期 HTML に含める / `min-height` を確保 |
| GSC で sitemap が「取得できませんでした」 | `robots.txt` で `/sitemap.xml` を Allow しているか | robots ファイルを確認 |
