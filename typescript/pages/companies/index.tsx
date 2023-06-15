import Link from 'next/link'
import { useState, ChangeEventHandler, MouseEventHandler } from "react"
import { useRouter } from "next/router"
import { DefaultApi, Configuration, FetchCompaniesSortTypeEnum, EachCompany, Meta } from "@/client"
import { NEXT_PUBLIC_API_URL } from "@/constant"
import CompanyTable from "@/components/CompanyTable"

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
      <div className="form-control">
        <div className="input-group">
          <input type="text" placeholder="社名 または 証券コード" className="input input-bordered w-full" value={query} onChange={handleQuery} />
          <button className="btn btn-square" onClick={handleSearch}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </div>
      </div>
      {/* search */}

      {/* companies */}
      <CompanyTable companies={companies} from={from} />
      {/* companies */}

      {/* pagination */}
      <div className="flex items-center justify-center">
        <div className="join">
          <button className={`join-item btn btn-sm ${prev ?? "btn-disabled"}`}>
            <Link href={{ pathname: '/companies', query: { page: page - 1 }}}>«</Link>
          </button>
          <button className="join-item btn btn-sm">Page {page}</button>
          <button className={`join-item btn btn-sm ${next ?? "btn-disabled"}`}>
            <Link href={{ pathname: '/companies', query: { page: page + 1 }}}>»</Link>
          </button>
        </div>
      </div>
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
