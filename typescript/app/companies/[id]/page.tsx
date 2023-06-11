import { DefaultApi, Configuration } from "@/client"
import { BASE_PATH } from "@/constant"
import Link from 'next/link'

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
          <dt className="col-span-1 bg-blueGray-100 p-2 border-neutral-content">社名</dt>
          <dd className="col-span-1 p-2 border-l border-neutral-content">
            {company.companyName}({company.companyNameEn})
          </dd>
          <dt className="col-span-1 bg-blueGray-100 p-2 border-t border-neutral-content">証券コード</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content">{company.securityCode}</dd>
          <dt className="col-span-1 bg-blueGray-100 p-2 border-t border-neutral-content">上場市場</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-accent hover:text-accent-focus">
            <Link href={{ pathname: `/markets/${company.marketId}` }}>{company.marketName}</Link>
          </dd>
          <dt className="col-span-1 bg-blueGray-100 p-2 border-t border-neutral-content">業種</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content text-accent hover:text-accent-focus">
            <Link href={{ pathname: `/markets/${company.industryId}` }}>{company.industryName}</Link>
          </dd>
          <dt className="col-span-1 bg-blueGray-100 p-2 border-t border-neutral-content">決算月</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content">
            {company.periodEndedAtMonth}月
          </dd>
          <dt className="col-span-1 bg-blueGray-100 p-2 border-t border-neutral-content">本店所在地</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content">{company.headOfficeLocation}</dd>
          <dt className="col-span-1 bg-blueGray-100 p-2 border-t border-neutral-content">代表者氏名</dt>
          <dd className="col-span-1 p-2 border-l border-t border-neutral-content">{company.representative}</dd>
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
  const config = new Configuration({ basePath: BASE_PATH })
  const DefaultAPI = new DefaultApi(config)
  const res = await DefaultAPI.fetchCompany({code: parseInt(id, 10)})
  const { company } = res
  return company
}
