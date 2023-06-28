import { FetchCompaniesSortTypeEnum } from "@/client"
import SearchInput from "@/components/SearchInput"
import SortTypes from "@/components/SortTypes"
import CompanyTable from "@/components/CompanyTable"
import Pagination from "@/components/Pagination"
import { useCompanies } from "@/hooks/FetchData"
import { Metadata } from 'next'
import { formatQueryParams } from "@/lib/utility"
import { getDictionary } from '@/hooks/GetDictionary'

export const metadata: Metadata = {
  title: "企業一覧",
}

export default async function Page(
  { params: { lang }, searchParams: { page = 1, sortType = "net_sales", q = "" } }:
  { params: { lang: string }, searchParams: { page: number, sortType: FetchCompaniesSortTypeEnum, q: string } })
{
  const dict = await getDictionary(lang)
  const fetchCompanies = useCompanies({ page, sortType, q })
  const { companies, meta } = await fetchCompanies
  const { from, prev, next } = meta

  return (
    <>
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
        prevRef={{ pathname: '/companies', query: formatQueryParams({ page: Number(page) - 1, sortType, q })}}
        nextRef={{ pathname: '/companies', query: formatQueryParams({ page: Number(page) + 1, sortType, q })}}
        prev={prev}
        next={next}
        dict={dict.components.Pagination}
      />
      {/* pagination */}
    </>
  )
}
