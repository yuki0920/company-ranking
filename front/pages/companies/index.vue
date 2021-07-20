<template>
  <div>
    <b-breadcrumb class="bg-white">
      <b-breadcrumb-item to="/">
        トップ
      </b-breadcrumb-item>
      <b-breadcrumb-item active>
        企業
      </b-breadcrumb-item>
    </b-breadcrumb>
    <pc-company-list :companies="companies" />
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import companies from '~/lib/companies'

export default defineComponent({
  setup () {
    return {
      companies
    }
  }
})
</script>
