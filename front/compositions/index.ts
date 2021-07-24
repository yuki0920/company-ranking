import { useContext, ref, useRoute } from '@nuxtjs/composition-api'

const replaceUrl = ({ page, sortType, industryId }: { page: number, sortType: string, industryId: number }) => {
  const industryIdParam = industryId ? `&industry_id=${industryId}` : ''

  window.history.replaceState(null, '', `${location.pathname}?page=${page}&sort_type=${sortType}${industryIdParam}`)
}

export const useCompany = () => {
  const { $axios } = useContext()
  const route = useRoute()
  const pageParam = typeof route.value.query.page === 'string' ? parseInt(route.value.query.page, 10) : null
  const page = ref(pageParam || 1)
  const from = ref(0)
  const sortType = ref(route.value.query.sort_type || 'average_annual_salary')
  const industryId = ref(route.value.params.industryId)
  const companies = ref([])

  const fetchCompanies = () => {
    return $axios.get('/api/v1/companies', { params: { page: page.value, sort_type: sortType.value } })
  }

  const infiniteHandler = ($state: any) => {
    // @ts-ignore
    replaceUrl({ page: page.value, sortType: sortType.value, industryId: industryId.value })

    fetchCompanies().then(({ data }) => {
      if (data.meta.page !== data.meta.pages) {
        page.value += 1
        if (from.value === 0) {
          from.value = parseInt(data.meta.from, 10)
        }
        // @ts-ignore
        companies.value.push(...data.companies)
        $state.loaded()
      } else {
        $state.complete()
      }
    })
  }

  const initInfiniteHandler = ({ sort, industry }:{ sort: string, industry: string }) => {
    if (sort) { sortType.value = sort }
    if (industry) { industryId.value = industry }

    page.value = 1
    companies.value = []
    from.value = 0
    // @ts-ignore
    infiniteHandler()
  }

  return { from, sortType, industryId, companies, infiniteHandler, initInfiniteHandler }
}

export const useIndustry = () => {
  const { $axios } = useContext()
  const industries = ref([])

  const fetchIndustries = async () => {
    const { data } = await $axios.get('/api/v1/industries')
    industries.value = data.industries
  }

  fetchIndustries()

  return { industries }
}
