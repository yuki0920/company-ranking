import { useState, ChangeEventHandler, MouseEventHandler } from "react"
import { useRouter } from "next/router"
import { DefaultApi, Configuration, FetchCompaniesSortTypeEnum, EachCompany, Meta } from "@/client"
import { NEXT_PUBLIC_API_URL } from "@/constant"
import CompanyTable from "@/components/CompanyTable"
import SearchBox from "@/components/SearchBox"
import Pagination from "@/components/Pagination"

export default function Companies({ companies, meta }: { companies: EachCompany[], meta: Meta }) {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const { page, from, prev, next } = meta

  const handleQuery: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setQuery(target.value)
  }

  const handleSearch: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
    router.push({
      pathname: "/companies",
      query: {
        q: query
      }
    })
  }

  return (
    <>
      {/* search */}
      <div className="mt-10">
        <SearchBox query={query} handleQuery={handleQuery} handleSearch={handleSearch} />
      </div>
      {/* search */}

      {/* companies */}
      <CompanyTable companies={companies} from={from} />
      {/* companies */}

      {/* pagination */}
      <Pagination
        prevRef={{ pathname: '/companies', query: { page: page - 1 }}}
        nextRef={{ pathname: '/companies', query: { page: page + 1 }}}
        page={page}
        prev={prev}
        next={next}
      />
      {/* pagination */}
    </>
  )
}

export async function getServerSideProps({
  query: {sortType = "net_sales", page = 1, q = "" }
}:{
  query: { sortType: FetchCompaniesSortTypeEnum, page: number, q: string }
}) {
  const config = new Configuration({ basePath: NEXT_PUBLIC_API_URL })
  const DefaultAPI = new DefaultApi(config)
  const res = await DefaultAPI.fetchCompanies({
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
