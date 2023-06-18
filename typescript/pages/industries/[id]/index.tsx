import { useState, ChangeEventHandler, MouseEventHandler } from "react"
import { useRouter } from "next/router"
import { DefaultApi, Configuration, FetchCompaniesSortTypeEnum, EachCompany, Meta } from "@/client"
import { NEXT_PUBLIC_API_URL } from "@/constant"
import CompanyTable from "@/components/CompanyTable"
import SearchBox from "@/components/SearchBox"
import SortButtons from "@/components/SortButtons"
import Pagination from "@/components/Pagination"

export default function Industries({ companies, meta }: { companies: EachCompany[], meta: Meta }) {
  const [query, setQuery] = useState("")
  const router = useRouter()
  let currentSortType: string
  if (router.query.sortType === undefined) {
    currentSortType = "net_sales"
  } else {
    currentSortType = router.query.sortType as string
  }
  const { page, from, prev, next } = meta
  const { id } = router.query

  const handleQuery: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setQuery(target.value)
  }

  const handleSearch: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
    router.push({
      pathname: `/industries/${id}`,
      query: {
        sortType: currentSortType,
        q: query,
      }
    })
  }

  const handleSortType: ChangeEventHandler<HTMLInputElement> = (e) => {
    const changedSortType = e.target.value as FetchCompaniesSortTypeEnum
    router.push({
      pathname: `/industries/${id}`,
      query: {
        sortType: changedSortType,
        q: query,
      }
    })
  }

  return (
    <>
      {/* search */}
      <SearchBox query={query} handleQuery={handleQuery} handleSearch={handleSearch} />
      {/* search */}

      {/* sort */}
      <SortButtons currentSortType={currentSortType} handleSortType={handleSortType} />
      {/* sort */}

      {/* companies */}
      <CompanyTable companies={companies} from={from} />
      {/* companies */}

      {/* pagination */}
      <Pagination
        prevRef={{ pathname: `/industries/${id}`, query: { page: page - 1 }}}
        nextRef={{ pathname: `/industries/${id}`, query: { page: page + 1 }}}
        page={page}
        prev={prev}
        next={next}
      />
      {/* pagination */}
    </>
  )
}

export async function getServerSideProps({
  query: {id, sortType = "net_sales", page = 1, q = "" }
}:{
  query: { id: number, sortType: FetchCompaniesSortTypeEnum, page: number, q: string }
}) {
  const config = new Configuration({ basePath: NEXT_PUBLIC_API_URL })
  const DefaultAPI = new DefaultApi(config)
  const res = await DefaultAPI.fetchCompanies({
    industryId: id,
    page: page,
    sortType: sortType,
    q: q,
  })
  const { companies, meta } = res
  return {
    props: {
      companies,
      meta
    }
  }
}
