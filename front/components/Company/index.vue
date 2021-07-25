<template>
  <div class="company-detail">
    <h4>{{ company.security_name }} の企業情報</h4>
    <h5>基本情報</h5>
    <dl class="company-detail__list row">
      <dt class="col-4">
        従業員数
      </dt>
      <dd class="col-8">
        {{ company.number_of_employees }} 人
      </dd>
      <dt class="col-4">
        平均年間給与
      </dt>
      <dd class="col-8">
        {{ numberWithDelimiter(company.average_annual_salary) }} 万円
      </dd>
      <dt class="col-4">
        平均年齢
      </dt>
      <dd class="col-8">
        {{ company.average_age_years }} 歳
      </dd>
      <dt class="col-4">
        平均勤続年数
      </dt>
      <dd class="col-8">
        {{ company.average_length_of_service_years }} 年
      </dd>
    </dl>
    <h5>基本情報</h5>
    <dl class="company-detail__list row">
      <dt class="col-4">
        社名
      </dt>
      <dd class="col-8">
        {{ company.company_name }} ({{ company.company_name_en }})
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
        {{ company.market_name }}
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
    <h5>
      決算情報
      <small class="text-muted">※連結ベース</small>
    </h5>
    <dl class="company-detail__list row">
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
        {{ numberWithDelimiter(company.last_year_net_sales) }} 百万円
      </dd>
      <dt class="col-4">
        当年度売上
      </dt>
      <dd class="col-8">
        {{ numberWithDelimiter(company.net_sales) }} 百万円
      </dd>
      <dt class="col-4">
        前年度営業利益
      </dt>
      <dd class="col-8" :style="{color: profitColor(company.last_year_operating_income)}">
        {{ numberWithDelimiter(company.last_year_operating_income) }} 百万円
      </dd>
      <dt class="col-4">
        当年度営業利益
      </dt>
      <dd class="col-8" :style="{color: profitColor(company.operating_income)}">
        {{ numberWithDelimiter(company.operating_income) }} 百万円
      </dd>
      <dt class="col-4">
        前年度経常利益
      </dt>
      <dd class="col-8" :style="{color: profitColor(company.last_year_ordinary_income)}">
        {{ numberWithDelimiter(company.last_year_ordinary_income) }} 百万円
      </dd>
      <dt class="col-4">
        当年度経常利益
      </dt>
      <dd class="col-8" :style="{color: profitColor(company.ordinary_income)}">
        {{ numberWithDelimiter(company.ordinary_income) }} 百万円
      </dd>
    </dl>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
// @ts-ignore
import { useUtility } from '~/lib/utility'

export default defineComponent({
  props: {
    company: {
      type: Object,
      required: true
    }
  },
  setup () {
    const { numberWithDelimiter, profitColor } = useUtility()

    return {
      numberWithDelimiter,
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
