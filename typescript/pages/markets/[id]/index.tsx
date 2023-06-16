import Link from 'next/link'
import { useState, ChangeEventHandler, MouseEventHandler } from "react"
import { useRouter } from "next/router"
import { DefaultApi, Configuration, FetchCompaniesSortTypeEnum, EachCompany, Meta } from "@/client"
import { NEXT_PUBLIC_API_URL } from "@/constant"
import CompanyTable from "@/components/CompanyTable"
import SearchBox from "@/components/SearchBox"

export default function Markets({ companies, meta }: { companies: EachCompany[], meta: Meta }) {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const { page, from, prev, next } = meta
  const { id } = router.query

  const handleQuery: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setQuery(target.value)
  }

  const handleSearch: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
    router.push({
      pathname: `/markets/${id}`,
      query: {
        q: query
      }
    })
  }

  return (
    <>
      {/* search */}
      <SearchBox query={query} handleQuery={handleQuery} handleSearch={handleSearch} />
      {/* search */}

      {/* companies */}
      <CompanyTable companies={companies} from={from} />
      {/* companies */}

      {/* pagination */}
      <div className="flex items-center justify-center">
        <div className="join">
          <button className={`join-item btn btn-sm ${prev ?? "btn-disabled"}`}>
            <Link href={{ pathname: `/markets/${id}`, query: { page: page - 1 }}}>«</Link>
          </button>
          <button className="join-item btn btn-sm">Page {page}</button>
          <button className={`join-item btn btn-sm ${next ?? "btn-disabled"}`}>
            <Link href={{ pathname: `/markets/${id}`, query: { page: page + 1 }}}>»</Link>
          </button>
        </div>
      </div>
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
    marketId: id,
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
