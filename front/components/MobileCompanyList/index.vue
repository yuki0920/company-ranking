<template>
  <ul class="list-group">
    <li v-for="company in companies" :key="company.security_id" class="list-group-item flex-column align-items-start">
      <NuxtLink :to="`/companies/${company.security_id}`">
        <div class="d-flex w-100 justify-content-between">
          <p class="mb-1">
            {{ company.security_name }}
          </p>
        </div>
        <small class="text-muted">
          年間給与 {{ numberWithDelimiter(company.average_annual_salary) }} 万円
        </small>
        <br>
        <small class="text-muted">
          売上 {{ numberWithDelimiter(company.net_sales) }} 百万円
        </small>
        <br>
        <small class="text-muted">
          経常利益
          <span :style="{color: profitColor(company.ordinary_income)}">
            {{ numberWithDelimiter(company.ordinary_income) }}
          </span>
          百万円
        </small>
      </NuxtLink>
    </li>
  </ul>
</template>
<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
// @ts-ignore
import { useUtility } from '~/lib/utility'

export default defineComponent({
  name: 'PcCompanyList',
  props: {
    companies: {
      type: Array,
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
