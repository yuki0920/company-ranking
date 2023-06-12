import { DefaultApi, Configuration } from "@/client"
import { NEXT_PUBLIC_API_URL } from "@/constant"
import Link from 'next/link'
import { numberWithDelimiter, divide_1_000, divide_1_000_000 } from "@/lib/utility"

export default async function Page({ params }: {
  params: {id: string}
}) {
  const company = await getCompany(params.id)
  return (
  <>
    {/* bread crumb */}
    <h1 className="text-xl">
      {company.companyName}の企業データ
    </h1>
    <div className="grid lg:grid-cols-2 gap-4">
      <div>
        <h2 className="text-l">
          企業概要
        </h2>
        <dl className="grid grid-cols-2 border border-neutral-content">
          <dt className="col-span-1 p-2 border-neutral-content">社名</dt>
          <dd className="col-span-1 p-2 border-l border-neutral-content text-right">
            {company.companyName}({company.companyNameEn})
          </dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">証券コード</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-right">
            {company.securityCode}
          </dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">上場市場</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-accent  hover:text-accent-focus text-right">
            <Link href={{ pathname: `/markets/${company.marketId}` }}>{company.marketName}</Link>
          </dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">業種</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-accent  hover:text-accent-focus text-right">
            <Link href={{ pathname: `/markets/${company.industryId}` }}>{company.industryName}</Link>
          </dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">決算月</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-right">
            {company.periodEndedAtMonth}月
          </dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">本店所在地</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-right">
            {company.headOfficeLocation}</dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">代表者氏名</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-right">
            {company.representative}</dd>
        </dl>
        <div className="justify-end mt-1 mb-2 flex">
          （{company.periodEndedAtYear}年{company.periodEndedAtMonth}月時点）
        </div>
      </div>

      <div>
        <h2 className="text-l">
        従業員情報
        </h2>
        <dl className="grid grid-cols-2 border border-neutral-content">
          <dt className="col-span-1 p-2 border-neutral-content">連結従業員数</dt>
          <dd className="col-span-1 p-2 border-l border-neutral-content text-right">
            {numberWithDelimiter(divide_1_000(company.consolidatedNumberOfEmployees))} 人
          </dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">単体従業員数</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-right">
            {numberWithDelimiter(company.numberOfEmployees)} 人
          </dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">平均年間給与</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-right">
            {numberWithDelimiter(company.averageAnnualSalary)} 千円
          </dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">平均年齢</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-right">
            {company.averageAgeYears} 年
          </dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">平均勤続年数</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-right">
            {company.averageLengthOfServiceYears} 年
          </dd>
        </dl>
        <div className="justify-end mt-1 mb-2 flex">
          （{company.periodEndedAtYear}年{company.periodEndedAtMonth}月時点）
        </div>
      </div>
    </div>
    <div className="grid lg:grid-cols-2 gap-4">
      <div>
        <h2 className="text-l">
        決算・業績推移
        </h2>
        <dl className="grid grid-cols-2 border border-neutral-content">
          <dt className="col-span-1 p-2 border-neutral-content">基準事業年度</dt>
          <dd className="col-span-1 p-2 border-l border-neutral-content text-right">
            {company.periodStartedAt} ~ {company.periodEndedAt}
          </dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">前年度売上</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-right">
            {numberWithDelimiter(divide_1_000_000(company.lastYearNetSales))} 百万円
          </dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">当年度売上</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-right">
            {numberWithDelimiter(divide_1_000_000(company.netSales))} 百万円
          </dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">前年度営業利益</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-right">
            {numberWithDelimiter(divide_1_000_000(company.lastYearOperatingIncome))} 百万円
          </dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">当年度営業利益</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-right">
            {numberWithDelimiter(divide_1_000_000(company.operatingIncome))} 百万円
          </dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">前年度経常利益</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-right">
            {numberWithDelimiter(divide_1_000_000(company.lastYearOrdinaryIncome))} 百万円
          </dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">当年度経常利益</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-right">
            {numberWithDelimiter(divide_1_000_000(company.ordinaryIncome))} 百万円
          </dd>
        </dl>
        <div className="justify-end mt-1 mb-2 flex">
          （{company.periodEndedAtYear}年{company.periodEndedAtMonth}月時点）
        </div>
      </div>
      <div>
        <h2 className="text-l">
        財務・指標
        </h2>
        <dl className="grid grid-cols-2 border border-neutral-content">
          <dt className="col-span-1 p-2 border-neutral-content">資本金</dt>
          <dd className="col-span-1 p-2 border-l border-neutral-content text-right">
            {numberWithDelimiter(divide_1_000_000(company.capitalStock))} 百万円
          </dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">純資産</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-right">
            {numberWithDelimiter(divide_1_000_000(company.netAssets))} 百万円
          </dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">総資産</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-right">
            {numberWithDelimiter(divide_1_000_000(company.totalAssets))} 百万円
          </dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">自己資本利益率(ROE)</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-right">
            {company.rateOfReturnOnEquity ? company.rateOfReturnOnEquity * 100 : "-" } %
          </dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">株価収益率(PER)</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-right">
            {numberWithDelimiter(company.priceEarningsRatio)} 倍
          </dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">営業CF</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-right">
            {numberWithDelimiter(divide_1_000_000(company.netCashProvidedByUsedInOperatingActivities))} 百万円
          </dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">投資CF</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-right">
            {numberWithDelimiter(divide_1_000_000(company.netCashProvidedByUsedInInvestingActivities))} 百万円
          </dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">財務CF</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-right">
            {numberWithDelimiter(divide_1_000_000(company.netCashProvidedByUsedInFinancingActivities))} 百万円
          </dd>
          <dt className="col-span-1 p-2 border-t border-neutral-content">現金及び現金同等物</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-right">
            {numberWithDelimiter(divide_1_000_000(company.cashAndCashEquivalents))} 百万円
          </dd>
        </dl>
        <div className="justify-end mt-1 mb-2 flex">
          （{company.periodEndedAtYear}年{company.periodEndedAtMonth}月時点）
        </div>
      </div>
    </div>
  </>
  )
}

const getCompany = async (id: string) => {
  const config = new Configuration({ basePath: NEXT_PUBLIC_API_URL })
  const DefaultAPI = new DefaultApi(config)
  const res = await DefaultAPI.fetchCompany({code: parseInt(id, 10)})
  const { company } = res
  return company
}
