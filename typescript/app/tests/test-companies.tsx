'use client'

import { useState, ChangeEventHandler, MouseEventHandler } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FetchCompaniesSortTypeEnum, EachCompany, Meta } from "@/client"
import SearchBox from "@/components/SearchBox"
import SortButtons from "@/components/SortButtons"
import CompanyTable from "@/components/CompanyTable"
import Pagination from "@/components/Pagination"

export default function TestCompanies({ companies, meta }: { companies: EachCompany[], meta: Meta }) {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { page, from, prev, next } = meta

  let currentSortType: string
  if (searchParams === null || searchParams.get("sortType") == null) {
    currentSortType = "net_sales"
  } else {
    currentSortType = searchParams.get("sortType") as string
  }

  const handleQuery: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setQuery(target.value)
  }

  const handleSearch: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
    if (query === "") return

    const params = new URLSearchParams()
    if (searchParams !== null) {
      const page = searchParams.get("page")
      if (page !== null) {
        params.set("page", page)
      }
      const sortType = searchParams.get("sortType")
      if (sortType !== null) {
        params.set("sortType", sortType)
      }
      params.set("q", query)
    }

    router.push(`/tests?${params.toString()}`)
  }

  const handleSortType: ChangeEventHandler<HTMLInputElement> = (e) => {
    const changedSortType = e.target.value as FetchCompaniesSortTypeEnum
    const params = new URLSearchParams()
    params.set("sortType", changedSortType)
    if (query !== "") {
      params.set("q", query)
    }
    router.push(`/tests?${params.toString()}`)
  }

  return (
    <>
      {/* search */}
      <SearchBox query={query} handleQuery={handleQuery} handleSearch={handleSearch} />
      {/* search */}

      {/* sort */}
      <SortButtons currentSortType={currentSortType} handleSortType={handleSortType} />
      {/* sort */}

      {/* companies */}
      <CompanyTable companies={companies} from={from} />
      {/* companies */}

      {/* pagination */}
      <Pagination
        prevRef={{ pathname: '/tests', query: { page: page - 1 }}}
        nextRef={{ pathname: '/tests', query: { page: page + 1 }}}
        page={page}
        prev={prev}
        next={next}
      />
      {/* pagination */}
    </>
  )
}