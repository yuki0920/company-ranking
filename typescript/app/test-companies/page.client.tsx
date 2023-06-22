'use client'

import { useEffect, useState } from "react"
import CompanyTable from "./CompanyTable"
import { EachCompanyJSON, MetaJSON } from "@/types"
import Pagination from "./Pagination"
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { NEXT_PUBLIC_API_URL } from "@/constant"

export function ClientCompanies() {
  const [companies, setCompanies] = useState<EachCompanyJSON[]>([])
  const [from, setFrom] = useState<number>(1)
  const [prev, setPrev] = useState<number | null>(null)
  const [next, setNext] = useState<number | null>(null)
  const searchParams = useSearchParams()
  const currentPage = searchParams !== null && searchParams.get('page') ? Number(searchParams.get('page')) : 1
  const [page, setPage] = useState(currentPage)

  const router = useRouter()
  const handleNextPage = () => {
    router.push(`/test-companies?page=${page + 1}`)
    setPage(page + 1)
  }
  const handlePrevPage = () => {
    router.push(`/test-companies?page=${page - 1}`)
    setPage(page - 1)
  }

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams()
      params.append("sort_type", "net_sales")
      params.append("page", page.toString())
      params.append("q", "")

      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/v1/companies?${params.toString()}`)
      const res = await response.json()

      const { companies, meta }: { companies: EachCompanyJSON[], meta: MetaJSON } = res
      const { page: pageData, from, prev, next } = meta
      setCompanies(companies)
      setPage(pageData)
      setFrom(from)
      setPrev(prev)
      setNext(next)
    })()
  }, [page])

  return (
    <>
      {/* companies */}
      <CompanyTable companies={companies} from={from} />
      {/* companies */}

      {/* pagination */}
      <Pagination
        prevRef={{ pathname: '/test-companies', query: { page: page - 1 }}}
        nextRef={{ pathname: '/test-companies', query: { page: page + 1 }}}
        page={page}
        prev={prev}
        next={next}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
      />
      {/* pagination */}
    </>
  )
}
