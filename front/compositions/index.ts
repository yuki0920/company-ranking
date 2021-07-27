import { useContext, ref, watch, useRoute } from '@nuxtjs/composition-api'

const replaceUrl = ({ page, sortType, query }: { page: number, sortType: string, query: string }) => {
  const queryParam = query !== undefined ? `&q=${query}` : ''

  window.history.replaceState(null, '', `${location.pathname}?page=${page}&sort_type=${sortType}${queryParam}`)
}

export const useCompany = () => {
  const { $axios } = useContext()
  const route = useRoute()
  const pageParam = typeof route.value.query.page === 'string' ? parseInt(route.value.query.page, 10) : null
  const page = ref(pageParam || 1)
  const count = ref(0)
  const from = ref(0)
  const sortType = ref(route.value.query.sort_type || 'net_sales')
  const industryId = ref(route.value.params.industryId)
  const query = ref(route.value.query.q)
  const companies = ref([])

  const fetchCompanies = () => {
    let params = { page: page.value, sort_type: sortType.value }
    // @ts-ignore
    params = industryId.value ? { ...params, industry_id: industryId.value } : params
    // @ts-ignore
    params = [null, undefined, ''].includes(query.value) ? { ...params, q: query.value } : params

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

  const infiniteHandler = ($state: any) => {
    // @ts-ignore
    replaceUrl({ page: page.value, sortType: sortType.value, query: query.value })

    fetchCompanies().then(({ data }) => {
      if (from.value === 0) {
        from.value = parseInt(data.meta.from, 10)
      }

      count.value = data.meta.count

      if (data.meta.items > 0) {
        page.value += 1
        // @ts-ignore
        companies.value.push(...data.companies)
        $state.loaded()
      } else {
        $state.complete()
      }
    })
  }

  return { count, from, sortType, query, industryId, companies, infiniteHandler }
}

export const useIndustries = () => {
  const { $axios } = useContext()
  const industries = ref([])

  const fetchIndustries = () => {
    return $axios.get('/api/v1/industries')
  }

  return { fetchIndustries, industries }
}

export const useIndustry = () => {
  const { $axios } = useContext()
  const route = useRoute()
  const industry = ref(null)
  const industryId = ref(route.value.params.industryId)

  const fetchIndustry = () => {
    return $axios.get(`api/v1/industries/${industryId.value}`)
  }

  return { fetchIndustry, industry }
}
