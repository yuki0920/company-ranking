import { ListCompaniesSortTypeEnum } from "@/client"
import SearchInput from "@/components/SearchInput"
import SortTypes from "@/components/SortTypes"
import CompanyTable from "@/components/CompanyTable"
import Pagination from "@/components/Pagination"
import { listCompanies } from "@/hooks/GetData"
import { Metadata } from "next"
import { formatQueryParams } from "@/lib/utility"
import { getDictionary } from "@/hooks/GetDictionary"
import NumberOfResults from "@/components/NumberOfResults"

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: string }
}): Promise<Metadata> {
  const dict = await getDictionary(lang)

  return {
    title: dict.pages.companies.title,
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
  const { offsetCount, totalCount, limitCount, currentPage, lastPage, prevPage, nextPage,  } = meta

  return (
    <>
      <h1 className='text-xl'>
        {dict.pages.companies.title}
        <NumberOfResults
          currentPage={currentPage}
          lastPage={lastPage}
          offsetCount={offsetCount}
          limitCount={limitCount}
          totalCount={totalCount}
          unit={dict.units.result}
        />
      </h1>
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
