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
            {{ numberWithDelimiter(company.net_sales) }} 億円
          </small>
        </dd>
        <dt class="col-4 mb-0">
          <small class="text-muted">
            経常利益
          </small>
        </dt>
        <dd class="col-8 text-right mb-0">
          <small class="text-muted">
            {{ numberWithDelimiter(company.ordinary_income) }} 億円
          </small>
        </dd>
        <dt class="col-4 mb-0">
          <small class="text-muted">年間給与</small>
        </dt>
        <dd class="col-8 text-right mb-0">
          <small class="text-muted">{{ numberWithDelimiter(company.average_annual_salary) }} 万円</small>
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
    const { numberWithDelimiter, profitColor } = useUtility()

    return {
      numberWithDelimiter,
      profitColor
    }
  }
})
</script>
