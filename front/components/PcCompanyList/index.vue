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
        <th v-if="!isIndustry" scope="col">
          業種
        </th>
        <th v-if="!isMarket" scope="col">
          上場市場
        </th>
        <th scope="col">
          売上(百万円)
        </th>
        <th scope="col">
          経常利益(百万円)
        </th>
        <th scope="col">
          年間給与(千円)
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(company, index) in companies" :key="`company_${index}`">
        <td class="text-center">
          {{ from + index }}
        </td>
        <td>
          <NuxtLink :to="`/companies/${company.security_code}`">
            {{ company.security_name }}
          </NuxtLink>
        </td>
        <td v-if="!isIndustry" class="text-right">
          {{ company.industry_name }}
        </td>
        <td v-if="!isMarket" class="text-right">
          {{ company.market_name }}
        </td>
        <td class="text-right">
          {{ numberWithDelimiter(divide_1_000_000(company.net_sales)) }}
        </td>
        <td class="text-right" :style="{color: profitColor(company.ordinary_income)}">
          {{ numberWithDelimiter(divide_1_000_000(company.ordinary_income)) }}
        </td>
        <td class="text-right">
          {{ numberWithDelimiter(divide_1_000(company.average_annual_salary)) }}
        </td>
      </tr>
    </tbody>
  </table>
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
    },
    from: {
      type: Number,
      required: true
    },
    isIndustry: {
      type: Boolean,
      required: false,
      default: false
    },
    isMarket: {
      type: Boolean,
      required: false,
      default: false
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
thead {
  position: sticky;
  top: 0;
}
</style>
