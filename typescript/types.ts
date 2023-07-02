export interface EachCompanyJSON {
  security_code: number
  security_name: string
  net_sales: number | null
  ordinary_income: number | null
  average_annual_salary: number | null
  industry_name: string
  market_name: string
}

export interface MetaJSON {
  from: number
  count: number
  items: number
  page: number
  pages: number
  prev: number | null
  next: number | null
}
