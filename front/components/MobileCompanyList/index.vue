<template>
  <ul class="list-group">
    <li v-for="company in companies" :key="company.security_code" class="list-group-item flex-column align-items-start">
      <div class="d-flex w-100 justify-content-between mb-1">
        <NuxtLink :to="`/companies/${company.security_code}`">
          <span>{{ company.security_name }}</span>
        </NuxtLink>
        <small class="text-muted">{{ company.industry_name }}・{{ company.market_name }}</small>
      </div>
      <dl class="row mb-0">
        <dt class="col-4 mb-0">
          <small class="text-muted">
            売上
          </small>
        </dt>
        <dd class="col-8 text-right mb-0">
          <small class="text-muted">
            {{ numberWithDelimiter(divide_1_000_000(company.net_sales)) }} 百万円
          </small>
        </dd>
        <dt class="col-4 mb-0">
          <small class="text-muted">
            経常利益
          </small>
        </dt>
        <dd class="col-8 text-right mb-0">
          <small class="text-muted">
            {{ numberWithDelimiter(divide_1_000_000(company.ordinary_income)) }} 百万円
          </small>
        </dd>
        <dt class="col-4 mb-0">
          <small class="text-muted">年間給与</small>
        </dt>
        <dd class="col-8 text-right mb-0">
          <small class="text-muted">{{ numberWithDelimiter(divide_1_000(company.average_annual_salary)) }} 千円</small>
        </dd>
      </dl>
    </li>
  </ul>
</template>
<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { useUtility } from '~/lib/utility'
import { EachCompany } from '~/types/typescript-angular/model/models'

export default defineComponent({
  name: 'PcCompanyList',
  props: {
    companies: {
      type: Array as PropType<EachCompany[]>,
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
