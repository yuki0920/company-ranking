<template>
  <b-card no-body>
    <b-card-header class="border-0">
      <h4 class="mb-0">
        企業
      </h4>
    </b-card-header>
    <div class="container">
      <b-table sticky-header="900px" hover :items="companies" :fields="fields">
        <template #cell(index)="data">
          {{ data.index + 1 }}
        </template>
      </b-table>
    </div>
  </b-card>
</template>
<script>
import { defineComponent } from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'PcCompanyList',
  props: {
    companies: {
      type: Array,
      required: true
    }
  },
  setup () {
    return {
      fields: [
        { key: 'index', label: '順位' },
        { key: 'name', label: '企業名' },
        { key: 'average_annual_salary', label: '平均給与(万円)' },
        { key: 'net_sales', label: '売上(千円)' },
        { key: 'ordinary_income', label: '経常利益(千円)' }
      ],
      currentPage: 1
    }
  }
})
</script>
