import { ListCompaniesSortTypeEnum } from "@/client"
import SearchInput from "@/components/SearchInput"
import SortTypes from "@/components/SortTypes"
import CompanyTable from "@/components/CompanyTable"
import Pagination from "@/components/Pagination"
import { listCompanies } from "@/hooks/GetData"
import { Metadata } from "next"
import { formatQueryParams } from "@/lib/utility"
import { getDictionary } from "@/hooks/GetDictionary"

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: string }
}): Promise<Metadata> {
  const dict = await getDictionary(lang)

  return {
    title: dict.pages.companies.metadata.title,
  }
}

export default async function Page({
  params: { lang },
  searchParams: { page = 1, sortType = "net_sales", q = "" },
}: {
  params: { lang: string }
  searchParams: {
    page: number
    sortType: ListCompaniesSortTypeEnum
    q: string
  }
}) {
  const dict = await getDictionary(lang)
  const { companies, meta } = await listCompanies({ page, sortType, q })
  const { offsetCount, prevPage, nextPage } = meta

  return (
    <>
      {/* search */}
      <SearchInput query={q} dict={dict.components.SearchInput} />
      {/* search */}

      {/* sort */}
      <SortTypes currentSortType={sortType} dict={dict.components.SortTypes} />
      {/* sort */}

      {/* companies */}
      <CompanyTable
        companies={companies}
        from={offsetCount}
        lang={lang}
        dict={dict.components.CompanyTable}
        markets={dict.models.markets}
        industries={dict.models.industries}
      />
      {/* companies */}

      {/* pagination */}
      <Pagination
        prevRef={{
          pathname: `/${lang}/companies`,
          query: formatQueryParams({ page: Number(page) - 1, sortType, q }),
        }}
        nextRef={{
          pathname: `/${lang}/companies`,
          query: formatQueryParams({ page: Number(page) + 1, sortType, q }),
        }}
        prev={prevPage}
        next={nextPage}
        dict={dict.components.Pagination}
      />
      {/* pagination */}
    </>
  )
}
