import { useContext, ref } from '@nuxtjs/composition-api'

export const useCompany = () => {
  const { $axios } = useContext()
  const page = ref(1)
  const sortType = ref('average_annual_salary')
  const companies = ref([])

  const fetchCompanies = () => {
    return $axios.get('/api/v1/companies', { params: { page: page.value, sort_type: sortType.value } })
  }

  const infiniteHandler = ($state: any) => {
    fetchCompanies().then(({ data }) => {
      if (data.meta.page !== data.meta.pages) {
        page.value += 1
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

  return { sortType, companies, infiniteHandler, initInfiniteHandler }
}
