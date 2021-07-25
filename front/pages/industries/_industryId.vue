<template>
  <div v-if="industry" class="container">
    <b-breadcrumb class="bg-white mb-0">
      <b-breadcrumb-item to="/">
        トップ
      </b-breadcrumb-item>
      <b-breadcrumb-item active>
        {{ industry.name }}
      </b-breadcrumb-item>
    </b-breadcrumb>
    <h5>
      {{ industry.name }} のランキング
      <small class="text-muted">
        (全{{ count }}社)
      </small>
    </h5>
    <select v-model="sortType" class="form-control col-sm-3 mb-3">
      <option value="net_sales">
        売上順
      </option>
      <option value="average_annual_salary">
        年間給与順
      </option>
    </select>
    <mobile-company-list v-if="isMobile" :companies="companies" />
    <pc-company-list v-else :companies="companies" :from="from" />
    <infinite-loading :identifier="sortType" @infinite="infiniteHandler" />
  </div>
</template>

<script>
import { defineComponent, useMeta } from '@nuxtjs/composition-api'
import InfiniteLoading from 'vue-infinite-loading'
import { useCompany, useIndustry } from '~/compositions'
import { useUtility } from '~/lib/utility'

export default defineComponent({
  components: { InfiniteLoading },
  setup () {
    const { isMobile } = useUtility()
    const { count, from, sortType, companies, infiniteHandler } = useCompany()
    const { industry } = useIndustry()

    const { title, meta } = useMeta()
    // TODO: 業界名をtitle,metaにしたい
    title.value = '業界別ランキング'
    meta.value = [
      { hid: 'description', name: 'description', content: '業界別の企業ランキングです。売上、利益、年収を掲載しています。' }
    ]

    return {
      isMobile,
      count,
      from,
      sortType,
      companies,
      industry,
      infiniteHandler
    }
  },
  head: {}
})
</script>
