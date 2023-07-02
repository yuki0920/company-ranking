import { DefaultApi, Configuration } from "@/client"
import { NEXT_PUBLIC_API_URL } from "@/constant"
import Link from "next/link"
import SearchInput from "@/components/SearchInput"
import { getDictionary } from "@/hooks/GetDictionary"

export default async function TopPage({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getDictionary(lang)

  const [{ industryCategories }, { markets }] = await Promise.all([getIndustries(), getMarkets()])

  return (
    <>
      {industryCategories !== null ? (
        <div className='toppage flex flex-col min-h-screen'>
          <div className='container mt-3'>
            <SearchInput query={""} dict={dict.components.SearchInput} isCompanies={true} />
            <Link href={`/${lang}/companies`}>
              <p className='link-text'>{dict.pages.top.all}</p>
            </Link>
            <section>
              <h2 className='flex items-center text-xl'>
                {/* icon */}
                {dict.pages.top.market}
              </h2>
              <ul className='row list-unstyled grid grid-cols-2 sm:grid-cols-6 gap-2'>
                {markets.map((market) => (
                  <li key={`market-${market.id}`} className='col-6 col-sm-2 link-text'>
                    <Link href={`${lang}/markets/${market.id}`}>
                      {
                        dict.models.markets[
                          market.id.toString() as keyof typeof dict.models.markets
                        ]
                      }
                      ({market.count})
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className='flex items-center text-xl'>
                {/* icon */}
                {dict.pages.top.industry}
              </h2>
              {industryCategories.map((industryCategory) => (
                <div key={`industry-category-${industryCategory.id}`}>
                  <ul className='row list-unstyled grid grid-cols-2 sm:grid-cols-6 gap-2'>
                    {industryCategory.industries !== null &&
                      industryCategory.industries.map((industry) => (
                        <li key={`industry-${industry.id}`} className='col-6 col-sm-2 link-text'>
                          <Link href={`${lang}/industries/${industry.id}`}>
                            {
                              dict.models.industries[
                                industry.code.toString() as keyof typeof dict.models.industries
                              ]
                            }
                            ({industry.count})
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </section>
          </div>
        </div>
      ) : (
        <div className='text-center mt-5'>
          <div className='spinner-border text-lighter' role='status'>
            <span className='sr-only'>Loading...</span>
          </div>
        </div>
      )}
    </>
  )
}

const getIndustries = async () => {
  const config = new Configuration({ basePath: NEXT_PUBLIC_API_URL })
  const DefaultAPI = new DefaultApi(config)
  return await DefaultAPI.fetchIndustries()
}

const getMarkets = async () => {
  const config = new Configuration({ basePath: NEXT_PUBLIC_API_URL })
  const DefaultAPI = new DefaultApi(config)
  return DefaultAPI.fetchMarkets()
}
