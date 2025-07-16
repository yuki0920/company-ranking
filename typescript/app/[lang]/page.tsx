import Link from "next/link"
import SearchInput from "@/components/SearchInput"
import { getDictionary } from "@/hooks/GetDictionary"
import { getMarkets, getIndustries } from "@/hooks/GetData"

export default async function TopPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params

  const { lang } = params

  const dict = await getDictionary(lang)
  const [industries, markets] = await Promise.all([getIndustries(), getMarkets()])

  return (
    <>
      {industries !== null && industries !== undefined ? (
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
                  <li key={`market-${market.id}`} className='link-text'>
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
              <ul className='row list-unstyled grid grid-cols-2 sm:grid-cols-6 gap-2'>
                {industries.map((industry) => (
                  <li key={`industry-${industry.id}`} className='link-text'>
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
