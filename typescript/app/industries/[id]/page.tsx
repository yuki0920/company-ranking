import { FetchCompaniesSortTypeEnum } from "@/client"
import SearchBox from "@/components/SearchInput"
import SortTypes from "@/components/SortTypes"
import CompanyTable from "@/components/CompanyTable"
import Pagination from "@/components/Pagination"
import { useCompanies, useIndustry as getIndustry  } from "@/hooks/FetchData"
import { Metadata } from 'next'
import { formatQueryParams } from "@/lib/utility"

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
  const industry = await getIndustry({ id })

  return (
    <>
      <h1 className="text-xl">
        {industry.name} 業界の企業一覧
      </h1>
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
        prevRef={{ pathname: `/industries/${id}`, query: formatQueryParams({ page: Number(page) - 1, sortType, q })}}
        nextRef={{ pathname: `/industries/${id}`, query: formatQueryParams({ page: Number(page) + 1, sortType, q })}}
        page={page}
        prev={prev}
        next={next}
      />
      {/* pagination */}
    </>
  )
}
