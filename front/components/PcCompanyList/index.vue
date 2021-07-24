<template>
  <table class="table table-hover">
    <thead class="bg-white">
      <tr class="text-center">
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
        <td class="text-center">
          {{ from + index }}
        </td>
        <td>
          <NuxtLink :to="`/companies/${company.security_id}`">
            {{ company.security_name }}
          </NuxtLink>
        </td>
        <td class="text-right">
          {{ numberWithDelimiter(company.average_annual_salary) }}
        </td>
        <td class="text-right">
          {{ numberWithDelimiter(company.net_sales) }}
        </td>
        <td class="text-right" :style="{color: profitColor(company.ordinary_income)}">
          {{ numberWithDelimiter(company.ordinary_income) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script lnag="ts">
import { defineComponent } from '@nuxtjs/composition-api'
// @ts-ignore
import { useUtility } from '~/lib/utility'

export default defineComponent({
  name: 'PcCompanyList',
  props: {
    companies: {
      type: Array,
      required: true
    },
    from: {
      type: Number,
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
thead {
  position: sticky;
  top: 0;
}
</style>
