import { useContext, ref, useRoute } from '@nuxtjs/composition-api'

export const useCompany = () => {
  const { $axios } = useContext()
  const route = useRoute()
  const pageParam = typeof route.value.query.page === 'string' ? parseInt(route.value.query.page, 10) : null
  const page = ref(pageParam || 1)
  const from = ref(0)
  const sortType = ref('average_annual_salary')
  const companies = ref([])

  const fetchCompanies = () => {
    return $axios.get('/api/v1/companies', { params: { page: page.value, sort_type: sortType.value } })
  }

  const infiniteHandler = ($state: any) => {
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

  const initInfiniteHandler = (sort: string) => {
    sortType.value = sort
    page.value = 1
    companies.value = []
    // @ts-ignore
    infiniteHandler()
  }

  return { from, sortType, companies, infiniteHandler, initInfiniteHandler }
}
