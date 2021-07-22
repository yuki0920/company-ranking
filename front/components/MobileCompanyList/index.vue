<template>
  <b-card no-body>
    <b-card-header class="border-0">
      <h4 class="mb-0">
        企業
      </h4>
    </b-card-header>
    <b-list-group>
      <b-list-group-item v-for="company in companies" :key="company.name" href="#" class="flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
          <h6 class="mb-1">
            {{ company.name }}
          </h6>
          年収 {{ company.average_annual_salary }} 千円
        </div>

        <small class="text-muted">
          売上 {{ company.net_sales }} 百万円
        </small>
        <br>
        <small class="text-muted">
          経常利益 {{ company.ordinary_income }} 百万円
        </small>
        <br>
      </b-list-group-item>
    </b-list-group>
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
    }
  }
})
</script>
