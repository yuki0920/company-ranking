<template>
  <div>
    <div class="container mt-3">
      <div v-if="industryCategories.length > 1">
        <NuxtLink to="/companies" class="d-block mb-2">
          <p>全ての企業から探す</p>
        </NuxtLink>
        <section>
          <h2>
            <b-icon-graph-up />
            市場から探す
          </h2>
          <ul class="row list-unstyled">
            <li v-for="market in markets" :key="`market-${market.id}`" class="col-6 col-sm-2">
              <NuxtLink :to="`/markets/${market.id}`">
                {{ market.name }}({{ market.count }})
              </NuxtLink>
            </li>
          </ul>
        </section>
        <section>
          <h2>
            <b-icon-building />
            業種から探す
          </h2>
          <div v-for="industryCategory in industryCategories" :key="`industry-category-${industryCategory.id}`">
            <h3>{{ industryCategory.name }}</h3>
            <ul class="row list-unstyled">
              <li v-for="industry in industryCategory.industries" :key="`industry-${industry.id}`" class="col-6 col-sm-2">
                <NuxtLink :to="`/industries/${industry.id}`">
                  {{ industry.name }}({{ industry.count }})
                </NuxtLink>
              </li>
            </ul>
          </div>
        </section>
      </div>
      <div v-else class="text-center mt-5">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang='ts'>
import { defineComponent, useMeta, onMounted } from '@nuxtjs/composition-api'
import { useIndustries, useMarkets } from '~/compositions'

export default defineComponent({
  setup () {
    const { fetchIndustries, industryCategories } = useIndustries()
    const { fetchMarkets, markets } = useMarkets()
    const { title, meta } = useMeta()
    title.value = 'トップ'
    meta.value = [
      { hid: 'description', name: 'description', content: '上場企業ランキングのトップページです。売上、利益、年収を掲載しています。' }
    ]

    onMounted(() => {
      Promise.all([
        fetchIndustries(),
        fetchMarkets()
      ]).then(([{ data: industriesData }, { data: marketsData }]) => {
        industryCategories.value = industriesData.industry_categories
        markets.value = marketsData.markets
      })
    })

    return {
      markets,
      industryCategories
    }
  },
  head: {}
})
</script>
