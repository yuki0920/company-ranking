<template>
  <div class="company-detail">
    <h4>{{ company.name }} の企業情報</h4>
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
        {{ company.average_annual_salary }} 万円
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
        証券コード
      </dt>
      <dd class="col-8">
        {{ company.code }}
      </dd>
      <dt class="col-4">
        市場
      </dt>
      <dd class="col-8">
        {{ company.segment_name }}
      </dd>
      <dt class="col-4">
        業種
      </dt>
      <dd class="col-8">
        {{ company.industry_name }}
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
        最新事業年度
      </dt>
      <dd class="col-8">
        {{ company.period_started_at }} - {{ company.period_ended_at }}
      </dd>
      <dt class="col-4">
        前年度売上
      </dt>
      <dd class="col-8">
        {{ company.last_year_net_sales }}
      </dd>
      <dt class="col-4">
        今年度売上
      </dt>
      <dd class="col-8">
        {{ company.net_sales }}
      </dd>
      <dt class="col-4">
        前年度営業利益
      </dt>
      <dd class="col-8">
        {{ company.last_year_operating_income }}
      </dd>
      <dt class="col-4">
        今年度営業利益
      </dt>
      <dd class="col-8">
        {{ company.operating_income }}
      </dd>
      <dt class="col-4">
        前年度経常利益
      </dt>
      <dd class="col-8">
        {{ company.last_year_ordinary_income }}
      </dd>
      <dt class="col-4">
        今年度経常利益
      </dt>
      <dd class="col-8">
        {{ company.ordinary_income }}
      </dd>
    </dl>
  </div>
</template>
<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    company: {
      type: Object,
      required: true
    }
  },
  setup () {
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
