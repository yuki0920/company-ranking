import { FetchCompaniesSortTypeEnum } from "@/client"
import SearchInput from "@/components/SearchInput"
import SortTypes from "@/components/SortTypes"
import CompanyTable from "@/components/CompanyTable"
import Pagination from "@/components/Pagination"
import { useCompanies, useIndustry as getIndustry  } from "@/hooks/FetchData"
import { Metadata } from 'next'
import { formatQueryParams } from "@/lib/utility"
import { getDictionary } from '@/hooks/GetDictionary'

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
  { params: { lang, id }, searchParams: { page = 1, sortType = "net_sales", q = "" }}:
  { params: { lang: string, id: number }, searchParams: { page: number, sortType: FetchCompaniesSortTypeEnum, q: string } })
{
  const dict = await getDictionary(lang)
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
      <SearchInput query={q} dict={dict.components.SearchInput} />
      {/* search */}

      {/* sort */}
      <SortTypes currentSortType={sortType} dict={dict.components.SortTypes} />
      {/* sort */}

      {/* companies */}
      <CompanyTable companies={companies} from={from} dict={dict.components.CompanyTable} />
      {/* companies */}

      {/* pagination */}
      <Pagination
        prevRef={{ pathname: `/industries/${id}`, query: formatQueryParams({ page: Number(page) - 1, sortType, q })}}
        nextRef={{ pathname: `/industries/${id}`, query: formatQueryParams({ page: Number(page) + 1, sortType, q })}}
        prev={prev}
        next={next}
        dict={dict.components.Pagination}
      />
      {/* pagination */}
    </>
  )
}
