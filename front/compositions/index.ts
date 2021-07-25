import { useContext, ref, watch, useRoute, onMounted } from '@nuxtjs/composition-api'

const replaceUrl = ({ page, sortType, industryId }: { page: number, sortType: string, industryId: number }) => {
  const industryIdParam = industryId ? `&industry_id=${industryId}` : ''

  window.history.replaceState(null, '', `${location.pathname}?page=${page}&sort_type=${sortType}${industryIdParam}`)
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
  const companies = ref([])

  const fetchCompanies = () => {
    return $axios.get('/api/v1/companies', { params: { page: page.value, sort_type: sortType.value, industry_id: industryId.value } })
  }

  watch(sortType, () => {
    companies.value = []
    from.value = 0
    page.value = 1
  })

  const infiniteHandler = ($state: any) => {
    // @ts-ignore
    replaceUrl({ page: page.value, sortType: sortType.value, industryId: industryId.value })

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

  return { count, from, sortType, industryId, companies, infiniteHandler }
}

export const useIndustries = () => {
  const { $axios } = useContext()
  const industries = ref([])

  const fetchIndustries = async () => {
    const { data } = await $axios.get('/api/v1/industries')
    industries.value = data.industries
  }

  fetchIndustries()

  return { industries }
}

export const useIndustry = () => {
  const { $axios } = useContext()
  const route = useRoute()
  const industry = ref(null)
  const industryId = ref(route.value.params.industryId)

  const fetchIndustry = () => {
    return $axios.get(`api/v1/industries/${industryId.value}`)
  }

  onMounted(async () => {
    await fetchIndustry()
  })

  return { fetchIndustry, industry }
}
