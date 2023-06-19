'use client'

import { useState, ChangeEventHandler, MouseEventHandler } from "react"
import {  EachCompany, Meta } from "@/client"
import SearchBox from "@/components/SearchBox"
import CompanyTable from "@/components/CompanyTable"
import { useRouter, useSearchParams } from "next/navigation"
import Pagination from "@/components/Pagination"

export default function TestCompanies({ companies, meta }: { companies: EachCompany[], meta: Meta }) {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { page, from, prev, next } = meta

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

  return (
    <>
      {/* search */}
      <SearchBox query={query} handleQuery={handleQuery} handleSearch={handleSearch} />
      {/* search */}

      {/* companies */}
      <CompanyTable companies={companies} from={from} />
      {/* companies */}

      {/* pagination */}
      <Pagination
        prevRef={{ pathname: '/companies', query: { page: page - 1 }}}
        nextRef={{ pathname: '/companies', query: { page: page + 1 }}}
        page={page}
        prev={prev}
        next={next}
      />
      {/* pagination */}
    </>
  )
}
