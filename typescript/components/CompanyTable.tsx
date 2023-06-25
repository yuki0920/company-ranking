'use client'

import Link from 'next/link'
import { numberWithDelimiter, divide_1_000, divide_1_000_000 } from "@/lib/utility"
import { EachCompany } from "@/client"
import { isMobile } from '@/lib/client.utility'

export default function CompanyTable({ companies, from }: { companies: EachCompany[], from: number }) {
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
                <Link href={{ pathname: `/companies/${company.securityCode}` }}>
                  <span className="link-text">{company.securityName}</span>
                </Link>
                <small className="">{company.industryName}・{company.marketName}</small>
              </div>
              <dl className="grid grid-cols-2 gap-x-4 mb-0 text-sm">
                <dt className="col-span-1">
                  順位
                </dt>
                <dd className="col-span-1 text-right">
                  {from + index}位
                </dd>
                <dt className="col-span-1">
                  売上
                </dt>
                <dd className="col-span-1 text-right">
                  {numberWithDelimiter(divide_1_000_000(company.netSales))} 百万円
                </dd>
                <dt className="col-span-1">年間給与</dt>
                <dd className="col-span-1 text-right">
                  {numberWithDelimiter(divide_1_000(company.averageAnnualSalary))} 千円
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
              <th>順位</th>
              <th>企業</th>
              <th>業種</th>
              <th>市場</th>
              <th className="text-right">売上(百万円)</th>
              <th className="text-right">平均給与(千円)</th>
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
                    <Link href={{ pathname: `/companies/${company.securityCode}` }}>{company.securityName}</Link>
                  </td>
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
}
