'use client'

import Link from 'next/link'
import { numberWithDelimiter, divide_1_000, divide_1_000_000 } from "@/lib/utility"
import { EachCompany } from "@/client"
import { isMobile } from '@/lib/client.utility'

export default function CompanyTable(
  { companies, from, lang, dict, markets, industries }:
  {
    companies: EachCompany[],
    from: number
    lang: string
    dict: {
      rank: string,
      rankUnit: string,
      sales: string,
      salesUnit: string,
      salary: string,
      salaryUnit: string,
      company: string,
      market: string,
      industry: string,
    },
    markets: object,
    industries: object,
  }
) {
  if (isMobile) {
    return (
      <ul className="divide-y">
        {/* Filter logic is workaround until next.js cache clear */}
        {companies.filter(company =>
          company.averageAnnualSalary !== null && company.averageAnnualSalary < 50_000_000
        ).map((company, index) => {
          return (
            <li key={index} className="border-b p-2">
              <div className="flex w-full justify-between mb-1">
                <Link href={{ pathname: `/${lang}/companies/${company.securityCode}` }}>
                  <span className="link-text">{lang == "en" ? company.securityNameEn : company.securityName}</span>
                </Link>
                <small className="">{markets[company.marketId as keyof typeof markets]}・{industries[company.industryCode as keyof typeof industries]}</small>
              </div>
              <dl className="grid grid-cols-2 gap-x-4 mb-0 text-sm">
                <dt className="col-span-1">
                  {dict.rank}
                </dt>
                <dd className="col-span-1 text-right">
                  {from + index}{dict.rankUnit}
                </dd>
                <dt className="col-span-1">
                {dict.sales}
                </dt>
                <dd className="col-span-1 text-right">
                  {numberWithDelimiter(divide_1_000_000(company.netSales))} {dict.salesUnit}
                </dd>
                <dt className="col-span-1">{dict.salary}</dt>
                <dd className="col-span-1 text-right">
                  {numberWithDelimiter(divide_1_000(company.averageAnnualSalary))} {dict.salaryUnit}
                </dd>
              </dl>
            </li>
          )
        })}
      </ul>
    )
  } else {
    return (
      <div className="overflow-x-auto">
        <table className="table table-sm">
          <thead>
            <tr className="text-left">
              <th>{dict.rank}</th>
              <th>{dict.company}</th>
              <th>{dict.industry}</th>
              <th>{dict.market}</th>
              <th className="text-right">{dict.sales}({dict.salesUnit})</th>
              <th className="text-right">{dict.salary}({dict.salaryUnit})</th>
            </tr>
          </thead>
          <tbody>
            {/* Filter logic is workaround until next.js cache clear */}
            {companies.filter(company =>
              company.averageAnnualSalary !== null && company.averageAnnualSalary < 50_000_000
            ).map((company, index) => {
              return (
                <tr key={index} className="hover">
                  <td>{from + index}</td>
                  <td className="link-text">
                    <Link href={{ pathname: `/${lang}/companies/${company.securityCode}` }}>{lang == "en" ? company.securityNameEn : company.securityName}</Link>
                  </td>
                  <td>{industries[company.industryCode as keyof typeof industries]}</td>
                  <td>{markets[company.marketId as keyof typeof markets]}</td>
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
}
