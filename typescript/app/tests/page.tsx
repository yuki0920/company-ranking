import { DefaultApi, Configuration, FetchCompaniesSortTypeEnum } from "@/client"
import { NEXT_PUBLIC_API_URL } from "@/constant"
import TestCompanies from "@/app/tests/test-companies"

export default async function Page(
  { searchParams: {sortType = "net_sales", page = 1, q = "" }}:
  { searchParams: { page: number | undefined, sortType: FetchCompaniesSortTypeEnum, q: string | undefined } })
{
  const { companies, meta } = await getCompanies({ page, sortType, q })

  return (
    <>
      {/* companies */}
        <TestCompanies companies={companies} meta={meta} />
      {/* companies */}
    </>
  )
}
const getCompanies = async (
  {page, sortType, q}:
  { page: number, sortType: FetchCompaniesSortTypeEnum, q: string }
) => {
  const config = new Configuration({ basePath: NEXT_PUBLIC_API_URL })
  const DefaultAPI = new DefaultApi(config)
  const { companies, meta } = await DefaultAPI.fetchCompanies({
    page: page,
    sortType: sortType,
    q: q,
  })

  return { companies, meta }
}
