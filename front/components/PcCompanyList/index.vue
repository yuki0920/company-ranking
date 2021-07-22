<template>
  <b-card no-body>
    <b-card-header class="border-0">
      <h4 class="mb-0">
        企業
      </h4>
    </b-card-header>
    <div class="container">
      <b-table hover :items="companies" :fields="fields">
        <template #cell(index)="data">
          {{ data.index + 1 }}
        </template>
        <template #cell(average_annual_salary)="data">
          {{ numberWithDelimiter(data.item.average_annual_salary) }}
        </template>
        <template #cell(net_sales)="data">
          {{ numberWithDelimiter(data.item.net_sales) }}
        </template>
        <template #cell(ordinary_income)="data">
          {{ numberWithDelimiter(data.item.ordinary_income) }}
        </template>
      </b-table>
    </div>
  </b-card>
</template>
<script lnag="ts">
import { defineComponent } from '@nuxtjs/composition-api'
// @ts-ignore
import { UseUtility } from '~/lib/utility'

export default defineComponent({
  name: 'PcCompanyList',
  props: {
    companies: {
      type: Array,
      required: true
    }
  },
  setup () {
    const { numberWithDelimiter } = UseUtility()

    return {
      numberWithDelimiter,
      fields: [
        { key: 'index', label: '順位' },
        { key: 'security_name', label: '企業名' },
        { key: 'average_annual_salary', label: '平均給与(万円)' },
        { key: 'net_sales', label: '売上(百万円))' },
        { key: 'ordinary_income', label: '経常利益(百万円))' }
      ]
    }
  }
})
</script>
