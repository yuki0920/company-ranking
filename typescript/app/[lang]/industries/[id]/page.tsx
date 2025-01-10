import { ListCompaniesSortTypeEnum } from "@/client"
import SearchInput from "@/components/SearchInput"
import SortTypes from "@/components/SortTypes"
import CompanyTable from "@/components/CompanyTable"
import Pagination from "@/components/Pagination"
import { listCompanies, getIndustry as getIndustry } from "@/hooks/GetData"
import { Metadata } from "next"
import { formatQueryParams } from "@/lib/utility"
import { getDictionary } from "@/hooks/GetDictionary"
import NumberOfResults from "@/components/NumberOfResults"
import Breadcrumbs from "@/components/BreadCrumbs"

export async function generateMetadata(props: {
  params: Promise<{ lang: string; id: number }>
}): Promise<Metadata> {
  const params = await props.params

  const { lang, id } = params

  const dict = await getDictionary(lang)
  const industryDict = dict.models.industries
  const industry = await getIndustry({ id })
  const description =
    lang === "ja" ? `${industry.name}の企業一覧です。` : `List of ${industry.name} companies.`

  return {
    title: `${industryDict[industry.code.toString() as keyof typeof industryDict]} ${
      dict.pages.markets.title
    }`,
    description: description,
  }
}

export default async function Page(props: {
  params: Promise<{ lang: string; id: number }>
  searchParams: Promise<{
    page: number
    sortType: ListCompaniesSortTypeEnum
    q: string
  }>
}) {
  const searchParams = await props.searchParams

  const { page = 1, sortType = "net_sales", q = "" } = searchParams

  const params = await props.params

  const { lang, id } = params

  const dict = await getDictionary(lang)
  const industryDict = dict.models.industries
  const { companies, meta } = await listCompanies({ industryId: id, page, sortType, q })
  const { offsetCount, totalCount, limitCount, currentPage, lastPage, prevPage, nextPage } = meta
  const industry = await getIndustry({ id })
  const title = industryDict[industry.code.toString() as keyof typeof industryDict]

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: dict.pages.top.title,
            path: `/${lang}`,
          },
          {
            label: title,
            path: `/${lang}/industries/${id}`,
          },
        ]}
      />
      <h1 className='text-xl'>
        {title} {dict.pages.industries.title}
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
          pathname: `/${lang}/industries/${id}`,
          query: formatQueryParams({ page: Number(page) - 1, sortType, q }),
        }}
        nextRef={{
          pathname: `/${lang}/industries/${id}`,
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
