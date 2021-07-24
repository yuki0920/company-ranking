<template>
  <div class="container">
    <b-breadcrumb class="bg-white mb-0">
      <b-breadcrumb-item to="/">
        トップ
      </b-breadcrumb-item>
      <b-breadcrumb-item active>
        すべての企業
      </b-breadcrumb-item>
    </b-breadcrumb>
    <h5>
      すべての企業
    </h5>
    <select :value="sortType" class="form-control col-sm-3 mb-3" @change="onChangeSortType">
      <option value="average_annual_salary">
        年間給与順
      </option>
      <option value="net_sales">
        売上順
      </option>
    </select>
    <mobile-company-list v-if="isMobile" :companies="companies" />
    <pc-company-list v-else :companies="companies" :from="from" />
    <infinite-loading @infinite="infiniteHandler" />
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import InfiniteLoading from 'vue-infinite-loading'
import { useCompany } from '~/compositions'
import { useUtility } from '~/lib/utility'

export default defineComponent({
  components: { InfiniteLoading },
  setup () {
    const { isMobile } = useUtility()
    const { from, sortType, companies, infiniteHandler, initInfiniteHandler } = useCompany()

    const onChangeSortType = (event) => {
      initInfiniteHandler({ sort: event.target.value })
    }

    return {
      isMobile,
      from,
      sortType,
      companies,
      infiniteHandler,
      onChangeSortType
    }
  }
})
</script>
