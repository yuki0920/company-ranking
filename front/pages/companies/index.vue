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
    <h5>
      すべての企業
    </h5>
    <select @change="onChangeSortType" :value="sortType" class="form-control col-sm-3 mb-3">
      <option value="average_annual_salary">年間給与順</option>
      <option value="net_sales">売上順</option>
    </select>
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

    const sortType = ref('average_annual_salary')

    const onChangeSortType = (event) => {
      sortType.value = event.target.value
      page.value = 1
      companies.value = []
      infiniteHandler()
    }

    const fetchCompanies = () => {
      return $axios.get('/api/v1/companies', { params: { page: page.value, sort_type: sortType.value } })
    }

    const infiniteHandler = ($state) => {
      fetchCompanies().then(({ data }) => {
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
      sortType,
      onChangeSortType,
      page,
      companies,
      infiniteHandler
    }
  }
})
</script>
