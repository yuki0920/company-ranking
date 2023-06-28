import { FetchCompaniesSortTypeEnum } from "@/client"
import SearchInput from "@/components/SearchInput"
import SortTypes from "@/components/SortTypes"
import CompanyTable from "@/components/CompanyTable"
import Pagination from "@/components/Pagination"
import { useCompanies, useMarket as getMarket } from "@/hooks/FetchData"
import { Metadata } from 'next'
import { formatQueryParams } from "@/lib/utility"

export async function generateMetadata(
  { params }: { params: { id: number } }
): Promise<Metadata> {
  const { id } = params
  const market = await getMarket({ id })

  return {
    title: `${market.name}の企業一覧`,
    description: `${market.name}の企業一覧です。`,
  }
}

export default async function Page(
  { params: { id }, searchParams: { page = 1, sortType = "net_sales", q = "" }}:
  { params: { id: number }, searchParams: { page: number, sortType: FetchCompaniesSortTypeEnum, q: string } })
{
  const fetchCompanies = useCompanies({ marketId: id, page, sortType, q })
  const { companies, meta } = await fetchCompanies
  const { from, prev, next } = meta
  const market = await getMarket({ id })

  return (
    <>
      <h1 className="text-xl">
        {market.name} 市場の企業一覧
      </h1>
      {/* search */}
      <SearchInput query={q} />
      {/* search */}

      {/* sort */}
      <SortTypes currentSortType={sortType} />
      {/* sort */}

      {/* companies */}
      <CompanyTable companies={companies} from={from} />
      {/* companies */}

      {/* pagination */}
      <Pagination
        prevRef={{ pathname: `/markets/${id}`, query: formatQueryParams({ page: Number(page) - 1, sortType, q })}}
        nextRef={{ pathname: `/markets/${id}`, query: formatQueryParams({ page: Number(page) + 1, sortType, q })}}
        page={page}
        prev={prev}
        next={next}
      />
      {/* pagination */}
    </>
  )
}
