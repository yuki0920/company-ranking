<template>
  <b-card no-body>
    <b-card-header class="border-0">
      <h4 class="mb-0">
        企業
      </h4>
    </b-card-header>
    <b-list-group>
      <b-list-group-item v-for="company in companies" :key="company.security_id" href="#" class="flex-column align-items-start">
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
          経常利益 {{ numberWithDelimiter(company.ordinary_income) }} 百万円
        </small>
        <br>
      </b-list-group-item>
    </b-list-group>
  </b-card>
</template>
<script lang="ts">
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
