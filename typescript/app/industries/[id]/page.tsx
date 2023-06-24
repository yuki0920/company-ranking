import { FetchCompaniesSortTypeEnum } from "@/client"
import SearchBox from "@/components/SearchInput"
import SortTypes from "@/components/SortTypes"
import CompanyTable from "@/components/CompanyTable"
import Pagination from "@/components/Pagination"
import { useCompanies, useIndustry as getIndustry  } from "@/hooks/FetchData"
import { Metadata } from 'next'

export async function generateMetadata(
  { params }: { params: { id: number } }
): Promise<Metadata> {
  const { id } = params
  const industry = await getIndustry({ id })

  return {
    title: `${industry.name}の企業一覧`,
    description: `${industry.name}の企業一覧です。`,
  }
}

export default async function Page(
  { params: { id }, searchParams: { page = 1, sortType = "net_sales", q = "" }}:
  { params: { id: number }, searchParams: { page: number, sortType: FetchCompaniesSortTypeEnum, q: string } })
{
  const fetchCompanies = useCompanies({ industryId: id, page, sortType, q })
  const { companies, meta } = await fetchCompanies
  const { from, prev, next } = meta

  return (
    <>
      {/* search */}
      <SearchBox query={q} />
      {/* search */}

      {/* sort */}
      <SortTypes currentSortType={sortType} />
      {/* sort */}

      {/* companies */}
      <CompanyTable companies={companies} from={from} />
      {/* companies */}

      {/* pagination */}
      <Pagination
        prevRef={{ pathname: `/industries/${id}`, query: { page: Number(page) - 1, sortType, q }}}
        nextRef={{ pathname: `/industries/${id}`, query: { page: Number(page) + 1, sortType, q }}}
        page={page}
        prev={prev}
        next={next}
      />
      {/* pagination */}
    </>
  )
}