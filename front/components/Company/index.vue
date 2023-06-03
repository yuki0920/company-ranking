<template>
  <div class="row company-detail">
    <div class="col-12 col-md-6">
      <h2>企業概要</h2>
      <dl class="company-detail__list row m-0">
        <dt class="col-4">
          社名
        </dt>
        <dd class="col-8">
          {{ company.company_name }}({{ company.company_name_en }})
        </dd>
        <dt class="col-4">
          証券コード
        </dt>
        <dd class="col-8">
          {{ company.security_code }}
        </dd>
        <dt class="col-4">
          上場市場
        </dt>
        <dd class="col-8">
          <NuxtLink :to="`/markets/${company.market_id}`">
            {{ company.market_name }}
          </NuxtLink>
        </dd>
        <dt class="col-4">
          業種
        </dt>
        <dd class="col-8">
          <NuxtLink :to="`/industries/${company.industry_id}`">
            {{ company.industry_name }}
          </NuxtLink>
        </dd>
        <dt class="col-4">
          決算月
        </dt>
        <dd class="col-8">
          {{ company.period_ended_at_month }}月
        </dd>
        <dt class="col-4">
          本店所在地
        </dt>
        <dd class="col-8">
          {{ company.head_office_location }}
        </dd>
        <dt class="col-4">
          代表者氏名
        </dt>
        <dd class="col-8">
          {{ company.representative }}
        </dd>
      </dl>
      <div class="d-flex justify-content-end mt-1 mb-2">
        （{{ company.period_ended_at_year }}年{{ company.period_ended_at_month }}月時点）
      </div>
    </div>
    <div class="col-12 col-md-6">
      <h2>従業員情報</h2>
      <dl class="company-detail__list row m-0">
        <dt class="col-4">
          従業員数
        </dt>
        <dd class="col-8">
          {{ numberWithDelimiter(company.consolidated_number_of_employees) }} 人（連結）／ {{ numberWithDelimiter(company.number_of_employees) }} 人（単独）
        </dd>
        <dt class="col-4">
          平均年間給与
        </dt>
        <dd class="col-8">
          {{ numberWithDelimiter(divide_1_000(company.average_annual_salary)) }} 千円（単独）
        </dd>
        <dt class="col-4">
          平均年齢
        </dt>
        <dd class="col-8">
          {{ company.average_age_years }} 歳（単独）
        </dd>
        <dt class="col-4">
          平均勤続年数
        </dt>
        <dd class="col-8">
          {{ company.average_length_of_service_years }} 年（単独）
        </dd>
      </dl>
      <div class="d-flex justify-content-end mt-1 mb-2">
        （{{ company.period_ended_at_year }}年{{ company.period_ended_at_month }}月時点）
      </div>
    </div>
    <div class="col-12 col-md-6">
      <h2>
        決算・業績推移
      </h2>
      <dl class="company-detail__list row m-0">
        <dt class="col-4">
          基準事業年度
        </dt>
        <dd class="col-8">
          {{ company.period_started_at }} 〜 {{ company.period_ended_at }}
        </dd>
        <dt class="col-4">
          前年度売上
        </dt>
        <dd class="col-8">
          {{ numberWithDelimiter(divide_1_000_000(company.last_year_net_sales)) }} 百万円
        </dd>
        <dt class="col-4">
          当年度売上
        </dt>
        <dd class="col-8">
          {{ numberWithDelimiter(divide_1_000_000(company.net_sales)) }} 百万円
        </dd>
        <dt class="col-4">
          前年度営業利益
        </dt>
        <dd class="col-8" :style="{color: profitColor(company.last_year_operating_income)}">
          {{ numberWithDelimiter(divide_1_000_000(company.last_year_operating_income)) }} 百万円
        </dd>
        <dt class="col-4">
          当年度営業利益
        </dt>
        <dd class="col-8" :style="{color: profitColor(company.operating_income)}">
          {{ numberWithDelimiter(divide_1_000_000(company.operating_income)) }} 百万円
        </dd>
        <dt class="col-4">
          前年度経常利益
        </dt>
        <dd class="col-8" :style="{color: profitColor(company.last_year_ordinary_income)}">
          {{ numberWithDelimiter(divide_1_000_000(company.last_year_ordinary_income)) }} 百万円
        </dd>
        <dt class="col-4">
          当年度経常利益
        </dt>
        <dd class="col-8" :style="{color: profitColor(company.ordinary_income)}">
          {{ numberWithDelimiter(divide_1_000_000(company.ordinary_income)) }} 百万円
        </dd>
      </dl>
      <div class="d-flex justify-content-end mt-1 mb-2">
        ※連結ベース（{{ company.period_ended_at_year }}年{{ company.period_ended_at_month }}月時点）
      </div>
    </div>
    <div class="col-12 col-md-6">
      <h2>
        財務・指標
      </h2>
      <dl class="company-detail__list row m-0">
        <dt class="col-4">
          資本金
        </dt>
        <dd class="col-8">
          {{ numberWithDelimiter(divide_1_000_000(company.capital_stock)) }} 百万円
        </dd>
        <dt class="col-4">
          純資産
        </dt>
        <dd class="col-8">
          {{ numberWithDelimiter(divide_1_000_000(company.net_assets)) }} 百万円
        </dd>
        <dt class="col-4">
          総資産
        </dt>
        <dd class="col-8">
          {{ numberWithDelimiter(divide_1_000_000(company.total_assets)) }} 百万円
        </dd>
        <dt class="col-4">
          自己資本比率
        </dt>
        <dd class="col-8">
          {{ numberWithDelimiter(company.equity_to_asset_ratio * 100) }} %
        </dd>
        <dt class="col-4">
          自己資本利益率(ROE)
        </dt>
        <dd class="col-8" :style="{color: profitColor(company.rate_of_return_on_equity)}">
          {{ numberWithDelimiter(company.rate_of_return_on_equity * 100) }} %
        </dd>
        <dt class="col-4">
          株価収益率(PER)
        </dt>
        <dd class="col-8">
          {{ numberWithDelimiter(company.price_earnings_ratio) }} 倍
        </dd>
        <dt class="col-4">
          営業CF
        </dt>
        <dd class="col-8" :style="{color: profitColor(company.net_cash_provided_by_used_in_operating_activities)}">
          {{ numberWithDelimiter(divide_1_000_000(company.net_cash_provided_by_used_in_operating_activities)) }} 百万円
        </dd>
        <dt class="col-4">
          投資CF
        </dt>
        <dd class="col-8" :style="{color: profitColor(company.net_cash_provided_by_used_in_investing_activities)}">
          {{ numberWithDelimiter(divide_1_000_000(company.net_cash_provided_by_used_in_investing_activities)) }} 百万円
        </dd>
        <dt class="col-4">
          財務CF
        </dt>
        <dd class="col-8" :style="{color: profitColor(company.net_cash_provided_by_used_in_financing_activities)}">
          {{ numberWithDelimiter(divide_1_000_000(company.net_cash_provided_by_used_in_financing_activities)) }} 百万円
        </dd>
        <dt class="col-4">
          現金及び現金同等物
          <br>
          の期末残高
        </dt>
        <dd class="col-8 d-flex align-items-center">
          {{ numberWithDelimiter(divide_1_000_000(company.cash_and_cash_equivalents)) }} 百万円
        </dd>
      </dl>
      <div class="d-flex justify-content-end mt-1 mb-2">
        ※連結ベース（{{ company.period_ended_at_year }}年{{ company.period_ended_at_month }}月時点）
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useUtility } from '~/lib/utility'

export default defineComponent({
  props: {
    company: {
      type: Object,
      required: true
    }
  },
  setup () {
    const { numberWithDelimiter, divide_1_000, divide_1_000_000, profitColor } = useUtility()

    return {
      numberWithDelimiter,
      divide_1_000,
      divide_1_000_000,
      profitColor
    }
  }
})
</script>
<style lang="scss" scoped>
$border-color: #ced4da;

.company-detail {
  &__list {
    border: 1px solid $border-color;
    border-top: none;
    margin-bottom: 0;

    dt {
      background: #f6f9fc;
      padding: .4rem;
      box-sizing: border-box;
      border-top: 1px solid $border-color;
    }
    dd {
      padding: .4rem;
      margin: 0;
      border-left: 1px solid $border-color;
      border-top: 1px solid $border-color;
      box-sizing: border-box;
    }

  }
}
</style>
