'use client'

import { useEffect, useState } from "react"
import CompanyTable from "./CompanyTable"
import { EachCompanyJSON, MetaJSON } from "@/types"

export function ClientCompanies() {
  const [companies, setCompanies] = useState<EachCompanyJSON[]>([])
  const [from, setFrom] = useState<number>(1)

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams()
      params.append("sort_type", "net_sales")
      params.append("page", "1")
      params.append("q", "")
      const response = await fetch(`http://localhost:3003/api/v1/companies?${params.toString()}`)
      const res = await response.json()
      const { companies, meta }: { companies: EachCompanyJSON[], meta: MetaJSON } = res
      const { from } = meta

      setFrom(from)
      setCompanies(companies)
    })()
  }, [])

  return (
    <>
      <CompanyTable
        companies={companies}
        from={from}
      />
    </>
  )
}
