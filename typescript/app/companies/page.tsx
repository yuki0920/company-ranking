'use client'

import { DefaultApi, Configuration } from "@/client"
import { BASE_PATH } from "@/constant"
import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { numberWithDelimiter, divide_1_000, divide_1_000_000 } from "@/lib/utility"
import { useState, ChangeEventHandler, MouseEventHandler } from "react"

export default async function Page() {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1
  const { companies, meta } = await getCompanies(currentPage)
  const { from, page, prev, next } = meta
  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setQuery(target.value)
  }
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    const path = pathname + '?' + params.set('q', query)
    router.push(path)
  }

  return (
    <div className="overflow-x-auto">
      {/* form */}
      <div className="form-control">
        <div className="input-group">
          <input type="text" placeholder="社名 または 証券コード" className="input input-bordered w-full" value={query} onChange={handleSearchChange} />
          <button className="btn btn-square" onClick={handleClick}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </div>
      </div>
      {/* table */}
      <table className="table table-sm">
        <thead>
          <tr className="text-left">
            <th>順位</th>
            <th>企業</th>
            <th>業種</th>
            <th>市場</th>
            <th className="text-right">売上(百万円)</th>
            <th className="text-right">平均給与(千円)</th>
          </tr>
        </thead>
        <tbody>
        {companies.map((company, index) => {
            return (
              <tr key={index}>
                <th>{from + index}</th>
                <td>{company.securityName}</td>
                <td>{company.industryName}</td>
                <td>{company.marketName}</td>
                <td className="text-right">{numberWithDelimiter(divide_1_000_000(company.netSales))}</td>
                <td className="text-right">{numberWithDelimiter(divide_1_000(company.averageAnnualSalary))}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
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
    </div>
  )
}

const getCompanies = async (page: number) => {
  const config = new Configuration({ basePath: BASE_PATH })
  const DefaultAPI = new DefaultApi(config)
  const res = await DefaultAPI.fetchCompanies({
    page: page,
    sortType: "net_sales",
  })
  const { companies, meta } = res
  return { companies, meta }
}
