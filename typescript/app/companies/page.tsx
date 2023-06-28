import { FetchCompaniesSortTypeEnum } from "@/client"
import SearchInput from "@/components/SearchInput"
import SortTypes from "@/components/SortTypes"
import CompanyTable from "@/components/CompanyTable"
import Pagination from "@/components/Pagination"
import { useCompanies } from "@/hooks/FetchData"
import { Metadata } from 'next'
import { formatQueryParams } from "@/lib/utility"

export const metadata: Metadata = {
  title: "企業一覧",
}

export default async function Page(
  { searchParams: { page = 1, sortType = "net_sales", q = "" }}:
  { searchParams: { page: number, sortType: FetchCompaniesSortTypeEnum, q: string } })
{
  const fetchCompanies = useCompanies({ page, sortType, q })
  const { companies, meta } = await fetchCompanies
  const { from, prev, next } = meta

  return (
    <>
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
        prevRef={{ pathname: '/companies', query: formatQueryParams({ page: Number(page) - 1, sortType, q })}}
        nextRef={{ pathname: '/companies', query: formatQueryParams({ page: Number(page) + 1, sortType, q })}}
        page={page}
        prev={prev}
        next={next}
      />
      {/* pagination */}
    </>
  )
}
