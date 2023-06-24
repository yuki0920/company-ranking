import { DefaultApi, Configuration } from "@/client"
import { NEXT_PUBLIC_API_URL } from "@/constant"
import Link from 'next/link'

export default async function TopPage() {
  const [{ industryCategories }, { markets }] = await Promise.all([
    getIndustries(),
    getMarkets()
  ])

  return (
    <>
      {industryCategories !== null ? (
        <div className="toppage flex flex-col min-h-screen">
          <div className="container mt-3">
            <Link href="/companies">
                <p className="link-text">全ての企業から探す</p>
            </Link>
            <section>
              <h2 className="flex items-center text-xl">
                {/* icon */}
                市場から探す
              </h2>
              <ul className="row list-unstyled grid grid-cols-2 sm:grid-cols-6 gap-2">
                {markets.map((market) => (
                  <li key={`market-${market.id}`} className="col-6 col-sm-2 link-text">
                    <Link href={`/markets/${market.id}`}>
                      {market.name}({market.count})
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="flex items-center text-xl">
                {/* icon */}
                業種から探す
              </h2>
              {industryCategories.map((industryCategory) => (
                <div key={`industry-category-${industryCategory.id}`}>
                  <h3>{industryCategory.name}</h3>
                  <ul className="row list-unstyled grid grid-cols-2 sm:grid-cols-6 gap-2">
                    {industryCategory.industries !== null && industryCategory.industries.map((industry) => (
                      <li key={`industry-${industry.id}`} className="col-6 col-sm-2 link-text">
                        <Link href={`/industries/${industry.id}`}>
                          {industry.name}({industry.count})
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
        <div className="text-center mt-5">
          <div className="spinner-border text-lighter" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </>
  );
};

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
