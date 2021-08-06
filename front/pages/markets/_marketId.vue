<template>
  <div v-if="market" class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb pl-0">
        <li class="breadcrumb-item">
          <NuxtLink to="/">
            トップ
          </NuxtLink>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          {{ market.name }}
        </li>
      </ol>
    </nav>
    <h1>
      東証 {{ market.name }} のランキング
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
    <mobile-company-list v-if="isMobile" :companies="companies" />
    <pc-company-list v-else :companies="companies" :from="from" :is-market="true" />
    <infinite-loading :identifier="sortType" spinner="bubbles" @infinite="infiniteHandler">
      <div slot="no-more" class="mb-3" />
      <div slot="no-results" class="mb-3">
        対象の企業はありません
      </div>
    </infinite-loading>
  </div>
</template>

<script lang='ts'>
import { defineComponent, useMeta, onMounted } from '@nuxtjs/composition-api'
import InfiniteLoading from 'vue-infinite-loading'
import { useCompany, useMarket } from '~/compositions'
import { useUtility } from '~/lib/utility'
import { ResponseMarket } from '~/types/typescript-angular/model/models'

export default defineComponent({
  components: { InfiniteLoading },
  setup () {
    const { isMobile } = useUtility()
    const { count, from, sortType, companies, infiniteHandler } = useCompany()
    const { fetchMarket, market } = useMarket()
    const { title, meta } = useMeta()

    onMounted(async () => {
      const { data }: { data: ResponseMarket } = await fetchMarket()
      market.value = data.market
      const marketName = market.value.name || '業種一覧'
      title.value = marketName
      meta.value = [
        { hid: 'description', name: 'description', content: `${marketName}の企業をランキング形式で掲載しています。売上、利益、年収を掲載しています。` }
      ]
    })

    return {
      isMobile,
      count,
      from,
      sortType,
      companies,
      market,
      infiniteHandler
    }
  },
  head: {}
})
</script>
