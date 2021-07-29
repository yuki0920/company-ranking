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
    <select v-model="sortType" class="form-control col-sm-3 mb-3">
      <option value="net_sales">
        売上順
      </option>
      <option value="average_annual_salary">
        年間給与順
      </option>
    </select>
    <input v-model="query" class="form-control  col-sm-3 mb-3" placeholder="社名 または 証券コード">
    <mobile-company-list v-if="isMobile" :companies="companies" />
    <pc-company-list v-else :companies="companies" :from="from" />
    <infinite-loading :identifier="[sortType, query]" spinner="bubbles" @infinite="infiniteHandler">
      <div slot="no-more" class="mb-3" />
      <div slot="no-results" class="mb-3" />
    </infinite-loading>
  </div>
</template>

<script lang='ts'>
import { defineComponent, useMeta } from '@nuxtjs/composition-api'
import InfiniteLoading from 'vue-infinite-loading'
// @ts-ignore
import { useCompany } from '~/compositions'
// @ts-ignore
import { useUtility } from '~/lib/utility'

export default defineComponent({
  components: { InfiniteLoading },
  setup () {
    const { isMobile } = useUtility()
    const { from, sortType, query, companies, infiniteHandler } = useCompany()
    const { title, meta } = useMeta()

    title.value = 'すべての企業'
    meta.value = [
      { hid: 'description', name: 'description', content: 'すべての企業情報です。年収、従業員数、平均年齢、売上、利益を掲載しています。' }
    ]

    return {
      isMobile,
      from,
      sortType,
      query,
      companies,
      infiniteHandler
    }
  },
  head: {}
})
</script>
