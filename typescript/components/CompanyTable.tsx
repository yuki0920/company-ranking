import Link from 'next/link'
import { numberWithDelimiter, divide_1_000, divide_1_000_000 } from "@/lib/utility"
import { EachCompany } from "@/client"

export default function CompanyTable({ companies, from }: { companies: EachCompany[], from: number }) {
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
