<template>
  <div>
    <b-breadcrumb class="bg-white">
      <b-breadcrumb-item to="/">
        トップ
      </b-breadcrumb-item>
      <b-breadcrumb-item to="/companies">
        企業
      </b-breadcrumb-item>
      <b-breadcrumb-item active>
        {{ company.name }}
      </b-breadcrumb-item>
    </b-breadcrumb>
    <div class="container">
      <company :company="company" />
    </div>
  </div>
</template>

<script>
import company from '~/lib/company.js'
export default {
  data () {
    return {
      company
    }
  }
}
</script>
