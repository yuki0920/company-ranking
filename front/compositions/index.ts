import { useContext, ref, watch, useRoute } from '@nuxtjs/composition-api'
import { StateChanger } from 'vue-infinite-loading/types'
import { EachCompany, ResponseCompanies, EachIndustryCategory, Industry, EachMarket, Market } from '~/types/typescript-angular/model/models'

export const useMetaTags = (title: string) => {
  const description = `${title}の業績、売上、利益、年収などの企業データをランキング形式で掲載しています。企業研究にご利用ください。`

  return [
    // NOTE: Google Analytics の検索ワードで漏れているキーワードを追加する
    // NOTE: titleには社名+証券コード+業界, 業界, 市場
    { hid: 'description', name: 'description', content: description },
    { hid: 'keyword', name: 'keyword', content: `${title},年収,年間収入,従業員数,平均年齢,業績,売上,利益,財務,資本金,総資産,自己資本利益率,ROE,キャッシュフロー,現金,上場企業,ランキング` },
    { hid: 'og:description', property: 'og:description', content: description },
    { hid: 'og:locale', property: 'og:locale', content: 'ja_JP' },
    { hid: 'og:type', property: 'og:type', content: 'website' },
    { hid: 'og:site_name', property: 'og:site_name', content: '上場企業ランキング' },
    { hid: 'og:title', property: 'og:title', content: `${title} | 上場企業ランキング` },
    { hid: 'og:url', property: 'og:url', content: `${location.href}` },
    { hid: 'article:author', property: 'article:author', content: 'https://www.facebook.com/ywsep20/' },
    { hid: 'og:image', property: 'og:image', content: '~/assets/img/ogp.jpg' },
    { hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
    { hid: 'twitter:site', name: 'twitter:site', content: '@YukiWebTech' }
  ]
}

export const useCompany = () => {
  const { $axios } = useContext()
  const route = useRoute()
  const pageParam = typeof route.value.query.page === 'string' ? parseInt(route.value.query.page, 10) : null
  const page = ref<number>(pageParam || 1)
  const count = ref<number>(0)
  const from = ref<number>(0)
  const sortType = ref<any>(route.value.query.sort_type || 'net_sales')
  const industryId = ref<any>(route.value.params.industryId)
  const marketId = ref<any>(route.value.params.marketId)
  const query = ref<any>(route.value.query.q)
  const companies = ref<Array<EachCompany>>([])

  const replaceUrl = ({ page, sortType, query }: { page: number, sortType: string, query: string }) => {
    const queryParam = [null, undefined, ''].includes(query) ? '' : `&q=${query}`
    const url = `${location.pathname}?page=${page}&sort_type=${sortType}${queryParam}`

    window.history.replaceState(null, '', url)
  }

  const fetchCompanies = () => {
    let params = { page: page.value, sort_type: sortType.value }
    // @ts-ignore
    params = industryId.value ? { ...params, industry_id: industryId.value } : params
    // @ts-ignore
    params = marketId.value ? { ...params, market_id: marketId.value } : params
    // @ts-ignore
    params = [null, undefined, ''].includes(query.value) ? params : { ...params, q: query.value }

    return $axios.get('/api/v1/companies', { params })
  }

  watch(sortType, () => {
    companies.value = []
    from.value = 0
    page.value = 1
  })

  watch(query, () => {
    companies.value = []
    from.value = 0
    page.value = 1
  })

  const infiniteHandler = ($state: StateChanger) => {
    // @ts-ignore
    replaceUrl({ page: page.value, sortType: sortType.value, query: query.value })

    fetchCompanies().then(({ data }: { data: ResponseCompanies }) => {
      if (from.value === 0) {
        from.value = data.meta.from
      }

      count.value = data.meta.count

      if (data.meta.items > 0) {
        page.value += 1
        companies.value.push(...data.companies)
        $state.loaded()
      } else {
        $state.complete()
      }
    })
  }

  return { count, from, sortType, query, industryId, marketId, companies, infiniteHandler }
}

export const useIndustries = () => {
  const { $axios } = useContext()
  const industryCategories = ref<EachIndustryCategory[]>([])

  const fetchIndustries = () => {
    return $axios.get('/api/v1/industries')
  }

  return { fetchIndustries, industryCategories }
}

export const useIndustry = () => {
  const { $axios } = useContext()
  const route = useRoute()
  const industry = ref<Industry | null>(null)
  const industryId = ref(route.value.params.industryId)

  const fetchIndustry = () => {
    return $axios.get(`api/v1/industries/${industryId.value}`)
  }

  return { fetchIndustry, industry }
}

export const useMarkets = () => {
  const { $axios } = useContext()
  const markets = ref<EachMarket[]>([])

  const fetchMarkets = () => {
    return $axios.get('/api/v1/markets')
  }

  return { fetchMarkets, markets }
}

export const useMarket = () => {
  const { $axios } = useContext()
  const route = useRoute()
  const market = ref<Market | null>(null)
  const marketId = ref(route.value.params.marketId)

  const fetchMarket = () => {
    return $axios.get(`api/v1/markets/${marketId.value}`)
  }

  return { fetchMarket, market }
}
