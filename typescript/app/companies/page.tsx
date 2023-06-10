'use client'

import { DefaultApi, Configuration } from "@/client"
import { BASE_PATH } from "@/constant"
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import { numberWithDelimiter, divide_1_000, divide_1_000_000 } from "@/lib/utility"

export default async function Page() {
  const searchParams = useSearchParams()
  const currentPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1
  const { companies, meta } = await getCompanies(currentPage)
  const { from, count, items, page, pages, prev, next } = meta

  return (
    <div className="overflow-x-auto">
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
