<template>
  <b-card no-body>
    <b-card-header class="border-0">
      <h4 class="mb-0">
        企業
      </h4>
    </b-card-header>
    <div class="container">
      <table class="table table-hover">
        <thead class="bg-white">
          <tr>
            <th scope="col">
              順位
            </th>
            <th scope="col">
              企業名
            </th>
            <th scope="col">
              年間給与(万円)
            </th>
            <th scope="col">
              売上(百万円)
            </th>
            <th scope="col">
              経常利益(百万円)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(company, index) in companies" :key="`company_${index}`">
            <td>{{ index + 1 }}</td>
            <td>{{ company.security_name }}</td>
            <td>{{ numberWithDelimiter(company.average_annual_salary) }}</td>
            <td>{{ numberWithDelimiter(company.net_sales) }}</td>
            <td>{{ numberWithDelimiter(company.ordinary_income) }}</td>
          </tr>
        </tbody>
      </table>
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
      numberWithDelimiter
    }
  }
})
</script>

<style lang="scss" scoped>
thead {
  position: sticky;
  top: 0;
}
</style>
