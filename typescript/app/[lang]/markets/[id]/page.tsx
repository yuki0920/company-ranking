import { ListCompaniesSortTypeEnum } from "@/client"
import SearchInput from "@/components/SearchInput"
import SortTypes from "@/components/SortTypes"
import CompanyTable from "@/components/CompanyTable"
import Pagination from "@/components/Pagination"
import { listCompanies, getMarket as getMarket } from "@/hooks/GetData"
import { Metadata } from "next"
import { formatQueryParams } from "@/lib/utility"
import { getDictionary } from "@/hooks/GetDictionary"

export async function generateMetadata({
  params: { lang, id },
}: {
  params: { lang: string; id: number }
}): Promise<Metadata> {
  const dict = await getDictionary(lang)
  const marketDict = dict.models.markets
  const market = await getMarket({ id })
  const description = (lang = "ja"
    ? `${market.name}の企業一覧です。`
    : `List of companies in ${market.name}.`)

  return {
    title: `${marketDict[market.id.toString() as keyof typeof marketDict]} ${
      dict.pages.markets.title
    }`,
    description: description,
  }
}

export default async function Page({
  params: { lang, id },
  searchParams: { page = 1, sortType = "net_sales", q = "" },
}: {
  params: { lang: string; id: number }
  searchParams: {
    page: number
    sortType: ListCompaniesSortTypeEnum
    q: string
  }
}) {
  const dict = await getDictionary(lang)
  const marketDict = dict.models.markets
  const { companies, meta } = await listCompanies({ marketId: id, page, sortType, q })
  const { offsetCount, prevPage, nextPage } = meta
  const market = await getMarket({ id })

  return (
    <>
      <h1 className='text-xl'>
        {marketDict[market.id.toString() as keyof typeof marketDict]} {dict.pages.markets.title}
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
          pathname: `/${lang}/markets/${id}`,
          query: formatQueryParams({ page: Number(page) - 1, sortType, q }),
        }}
        nextRef={{
          pathname: `/${lang}/markets/${id}`,
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
