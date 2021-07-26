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
    <infinite-loading :identifier="sortType" spinner="bubbles" @infinite="infiniteHandler">
      <div slot="no-more" class="mb-3" />
      <div slot="no-results" class="mb-3">
        対象の企業はありません
      </div>
    </infinite-loading>
  </div>
</template>

<script>
import { defineComponent, useMeta, onMounted } from '@nuxtjs/composition-api'
import InfiniteLoading from 'vue-infinite-loading'
import { useCompany, useIndustry } from '~/compositions'
import { useUtility } from '~/lib/utility'

export default defineComponent({
  components: { InfiniteLoading },
  setup () {
    const { isMobile } = useUtility()
    const { count, from, sortType, companies, infiniteHandler } = useCompany()
    const { fetchIndustry, industry } = useIndustry()
    const { title, meta } = useMeta()

    onMounted(async () => {
      const { data } = await fetchIndustry()
      industry.value = data.industry
      title.value = industry.value.name
      meta.value = [
        { hid: 'description', name: 'description', content: `${industry.value.name}の企業をランキング形式で掲載しています。売上、利益、年収を掲載しています。` }
      ]
    })

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
