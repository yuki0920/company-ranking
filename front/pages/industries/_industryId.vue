<template>
  <div v-if="industry" class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb pl-0">
        <li class="breadcrumb-item">
          <NuxtLink to="/">
            トップ
          </NuxtLink>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          {{ industry.name }}
        </li>
      </ol>
    </nav>
    <h1>
      {{ industry.name }} のランキング
      <small class="text-muted">
        (全{{ count }}社)
      </small>
    </h1>
    <select v-model="sortType" class="form-control col-sm-3 mb-3">
      <option value="net_sales">
        売上順
      </option>
      <option value="average_annual_salary">
        年間給与順
      </option>
      <option value="ordinary_income">
        経常利益順
      </option>
    </select>
    <input v-model="query" class="form-control  col-sm-3 mb-3" placeholder="社名 または 証券コード">
    <mobile-company-list v-if="isMobile" :companies="companies" />
    <pc-company-list v-else :companies="companies" :from="from" :is-industry="true" />
    <infinite-loading :identifier="[sortType, query]" spinner="bubbles" @infinite="infiniteHandler">
      <div slot="no-more" class="mb-3" />
      <div slot="no-results" class="mb-3" />
    </infinite-loading>
  </div>
</template>

<script lang='ts'>
import { defineComponent, useMeta, onMounted } from '@nuxtjs/composition-api'
import InfiniteLoading from 'vue-infinite-loading'
import { useCompany, useIndustry } from '~/compositions'
import { useUtility } from '~/lib/utility'
import { ResponseIndustry } from '~/types/typescript-angular/model/models'

export default defineComponent({
  components: { InfiniteLoading },
  setup () {
    const { isMobile } = useUtility()
    const { count, from, sortType, query, companies, infiniteHandler } = useCompany()
    const { fetchIndustry, industry } = useIndustry()
    const { title, meta } = useMeta()

    onMounted(async () => {
      const { data }: { data: ResponseIndustry } = await fetchIndustry()
      industry.value = data.industry
      const industryName = industry.value.name || '業種一覧'
      title.value = industryName
      meta.value = [
        { hid: 'description', name: 'description', content: `${industryName}の企業をランキング形式で掲載しています。売上、利益、年収を掲載しています。` }
      ]
    })

    return {
      isMobile,
      count,
      from,
      sortType,
      query,
      companies,
      industry,
      infiniteHandler
    }
  },
  head: {}
})
</script>
