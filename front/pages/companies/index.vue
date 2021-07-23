<template>
  <div class="container">
    <b-breadcrumb class="bg-white mb-0">
      <b-breadcrumb-item to="/">
        トップ
      </b-breadcrumb-item>
      <b-breadcrumb-item active>
        企業
      </b-breadcrumb-item>
    </b-breadcrumb>
    <h4>
      すべての企業
    </h4>
    <mobile-company-list v-if="isMobile" :companies="companies" />
    <pc-company-list v-else :companies="companies" />
    <infinite-loading @infinite="infiniteHandler" />
  </div>
</template>

<script>
import { defineComponent, useContext, ref } from '@nuxtjs/composition-api'
import InfiniteLoading from 'vue-infinite-loading'

export default defineComponent({
  components: { InfiniteLoading },
  setup () {
    const isMobile = window.innerWidth < 576
    const page = ref(1)
    const companies = ref([])
    const { $axios } = useContext()

    const infiniteHandler = ($state) => {
      $axios.get('/api/v1/companies', { params: { page: page.value } }).then(({ data }) => {
        if (data.meta.page !== data.meta.pages) {
          page.value += 1
          companies.value.push(...data.companies)
          $state.loaded()
        } else {
          $state.complete()
        }
      })
    }

    return {
      isMobile,
      page,
      companies,
      infiniteHandler
    }
  }
})
</script>
