import { DefaultApi, Configuration } from "@/client"
import { NEXT_PUBLIC_API_URL } from "@/constant"
import Link from "next/link"
import { numberWithDelimiter, percentNumber, divide_1_000, divide_1_000_000 } from "@/lib/utility"
import { Metadata } from "next"
import { getDictionary } from "@/hooks/GetDictionary"
import { i18n } from "@/dictionaries/i18n-config"
import { getCompany } from "@/hooks/GetData"
import Breadcrumbs from "@/components/BreadCrumbs"

export async function generateMetadata(props: {
  params: Promise<{ lang: string; id: number }>
}): Promise<Metadata> {
  const params = await props.params

  const { lang, id } = params

  const company = await getCompany({ code: id })
  const name = lang === "ja" ? company.companyName : company.companyNameEn
  const description =
    lang === "ja"
      ? `${company.companyName}の企業情報です。`
      : `This is the company information of ${company.companyNameEn}.`

  return {
    title: `[${company.securityCode}]${name}`,
    description: `[${company.securityCode}]${description}`,
  }
}

export default async function Page(props: { params: Promise<{ lang: string; id: number }> }) {
  const params = await props.params

  const { lang, id } = params

  const dictionary = await getDictionary(lang)
  const dict = dictionary.pages.company
  const marketDict = dictionary.models.markets
  const industryDict = dictionary.models.industries
  const company = await getCompany({ code: id })
  const companyName = lang == "ja" ? company.companyName : company.companyNameEn
  const marketName = marketDict[company.marketId.toString() as keyof typeof marketDict]
  const industryName = industryDict[company.industryCode.toString() as keyof typeof industryDict]

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: dictionary.pages.top.title,
            path: `/${lang}`,
          },
          {
            label: marketName,
            path: `/${lang}/markets/${company.marketId}`,
          },
          {
            label: industryName,
            path: `/${lang}/industries/${company.industryId}`,
          },
          {
            label: companyName,
            path: `/${lang}/companies/${id}`,
          },
        ]}
      />
      <h1 className='text-xl'>{companyName}</h1>
      <div className='grid lg:grid-cols-2 gap-4'>
        <div>
          <h2 className='text-l'>{dict.companySummary}</h2>
          <dl className='grid grid-cols-2 border border-neutral-content'>
            <dt className='col-span-1 p-2 border-neutral-content'>{dict.companyName}</dt>
            <dd className='col-span-1 p-2 border-l border-neutral-content text-right'>
              {company.companyName}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>{dict.companyNameEN}</dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {company.companyNameEn}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>{dict.securityCode}</dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {company.securityCode}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>{dict.marketName}</dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content link-text text-right'>
              <Link href={{ pathname: `/${lang}/markets/${company.marketId}` }}>{marketName}</Link>
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>{dict.industryName}</dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content link-text text-right'>
              <Link href={{ pathname: `/${lang}/industries/${company.industryId}` }}>
                {industryName}
              </Link>
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>
              {dict.periodEndedAtMonth}
            </dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {company.periodEndedAtMonth}
              {dict.units.month}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>
              {dict.headOfficeLocation}
            </dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {company.headOfficeLocation}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>
              {dict.representative}
            </dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {company.representative}
            </dd>
          </dl>
          <div className='justify-end mt-1 mb-2 flex'>
            （{company.periodEndedAtYear}
            {dict.units.periodYear}
            {company.periodEndedAtMonth}
            {dict.units.month}）
          </div>
        </div>

        <div>
          <h2 className='text-l'>{dict.employeeInfo}</h2>
          <dl className='grid grid-cols-2 border border-neutral-content'>
            <dt className='col-span-1 p-2 border-neutral-content'>
              {dict.consolidatedNumberOfEmployees}
            </dt>
            <dd className='col-span-1 p-2 border-l border-neutral-content text-right'>
              {numberWithDelimiter(company.consolidatedNumberOfEmployees)}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>
              {dict.numberOfEmployees}
            </dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {numberWithDelimiter(company.numberOfEmployees)}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>
              {dict.averageAnnualSalary}
            </dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {numberWithDelimiter(divide_1_000(company.averageAnnualSalary))}{" "}
              {dict.units.thousandYen}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>
              {dict.averageAgeYears}
            </dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {company.averageAgeYears}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>
              {dict.averageLengthOfServiceYears}
            </dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {company.averageLengthOfServiceYears}
            </dd>
          </dl>
          <div className='justify-end mt-1 mb-2 flex'>
            （{company.periodEndedAtYear}
            {dict.units.periodYear}
            {company.periodEndedAtMonth}
            {dict.units.month}）
          </div>
        </div>
      </div>
      <div className='grid lg:grid-cols-2 gap-4'>
        <div>
          <h2 className='text-l'>{dict.financialResults}</h2>
          <dl className='grid grid-cols-2 border border-neutral-content'>
            <dt className='col-span-1 p-2 border-neutral-content'>{dict.period}</dt>
            <dd className='col-span-1 p-2 border-l border-neutral-content text-right'>
              {company.periodStartedAt} ~ {company.periodEndedAt}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>
              {dict.lastYearNetSales}
            </dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {numberWithDelimiter(divide_1_000_000(company.lastYearNetSales))}{" "}
              {dict.units.millionYen}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>{dict.netSales}</dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {numberWithDelimiter(divide_1_000_000(company.netSales))} {dict.units.millionYen}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>
              {dict.lastYearOperatingIncome}
            </dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {numberWithDelimiter(divide_1_000_000(company.lastYearOperatingIncome))}{" "}
              {dict.units.millionYen}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>
              {dict.operatingIncome}
            </dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {numberWithDelimiter(divide_1_000_000(company.operatingIncome))}{" "}
              {dict.units.millionYen}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>
              {dict.lastYearOrdinaryIncome}
            </dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {numberWithDelimiter(divide_1_000_000(company.lastYearOrdinaryIncome))}{" "}
              {dict.units.millionYen}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>
              {dict.ordinaryIncome}
            </dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {numberWithDelimiter(divide_1_000_000(company.ordinaryIncome))}{" "}
              {dict.units.millionYen}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>{dict.totalAssets}</dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {numberWithDelimiter(divide_1_000_000(company.totalAssets))} {dict.units.millionYen}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>
              {dict.netCashProvidedByUsedInOperatingActivities}
            </dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {numberWithDelimiter(
                divide_1_000_000(company.netCashProvidedByUsedInOperatingActivities),
              )}{" "}
              {dict.units.millionYen}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>
              {dict.netCashProvidedByUsedInInvestingActivities}
            </dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {numberWithDelimiter(
                divide_1_000_000(company.netCashProvidedByUsedInInvestingActivities),
              )}{" "}
              {dict.units.millionYen}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>
              {dict.netCashProvidedByUsedInFinancingActivities}
            </dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {numberWithDelimiter(
                divide_1_000_000(company.netCashProvidedByUsedInFinancingActivities),
              )}{" "}
              {dict.units.millionYen}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>
              {dict.cashAndCashEquivalents}
            </dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {numberWithDelimiter(divide_1_000_000(company.cashAndCashEquivalents))}{" "}
              {dict.units.millionYen}
            </dd>
          </dl>
          <div className='justify-end mt-1 mb-2 flex'>
            （{company.periodEndedAtYear}
            {dict.units.periodYear}
            {company.periodEndedAtMonth}
            {dict.units.month}）
          </div>
        </div>
        <div>
          <h2 className='text-l'>{dict.financialIndicators}</h2>
          <dl className='grid grid-cols-2 border border-neutral-content'>
            <dt className='col-span-1 p-2 border-neutral-content'>{dict.capitalStock}</dt>
            <dd className='col-span-1 p-2 border-l border-neutral-content text-right'>
              {numberWithDelimiter(divide_1_000_000(company.capitalStock))} {dict.units.millionYen}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>
              {dict.totalNumberOfIssuedShares}
            </dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {numberWithDelimiter(company.totalNumberOfIssuedShares)}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>{dict.netAssets}</dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {numberWithDelimiter(divide_1_000_000(company.netAssets))} {dict.units.millionYen}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>
              {dict.equityToAssetRatio}
            </dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {percentNumber(company.equityToAssetRatio)} %
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>
              {dict.rateOfReturnOnEquity}
            </dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {percentNumber(company.rateOfReturnOnEquity)} %
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>
              {dict.priceEarningsRatio}
            </dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {numberWithDelimiter(company.priceEarningsRatio)} {dict.units.times}
            </dd>
            <dt className='col-span-1 p-2 border-t border-neutral-content'>{dict.payoutRatio}</dt>
            <dd className='col-span-1 p-2 border-l border-t border-neutral-content text-right'>
              {percentNumber(company.payoutRatio)} %
            </dd>
          </dl>
          <div className='justify-end mt-1 mb-2 flex'>
            （{company.periodEndedAtYear}
            {dict.units.periodYear}
            {company.periodEndedAtMonth}
            {dict.units.month}）
          </div>
        </div>
      </div>
    </>
  )
}

export async function generateStaticParams() {
  const config = new Configuration({ basePath: NEXT_PUBLIC_API_URL })
  const DefaultAPI = new DefaultApi(config)
  let securityCodes: Array<string> = []
  try {
    const res = await DefaultAPI.listSecurityCodes()
    securityCodes = res?.securityCodes ?? []
  } catch (error) {
    console.error("Error in generateStaticParams: Failed to fetch security codes", error)
  }
  const params = i18n.locales.flatMap((locale) => {
    return securityCodes.map((code) => {
      return {
        id: code.toString(),
        lang: locale,
      }
    })
  })

  return params
}
