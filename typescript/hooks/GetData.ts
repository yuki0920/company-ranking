import {
  DefaultApi,
  Configuration,
  ListCompaniesSortTypeEnum,
  ListCompaniesRequest,
} from "@/client"
import { NEXT_PUBLIC_API_URL } from "@/constant"

const config = new Configuration({ basePath: NEXT_PUBLIC_API_URL })
const api = new DefaultApi(config)

export const listCompanies = async ({
  page,
  sortType,
  q,
  marketId,
  industryId,
}: {
  page: number
  sortType: ListCompaniesSortTypeEnum
  q: string
  marketId?: number
  industryId?: number
}) => {
  const params: ListCompaniesRequest = { page, sortType, q }
  if (marketId !== null) params["marketId"] = marketId
  if (industryId !== null) params["industryId"] = industryId

  const { companies, meta } = await api.listCompanies(params)
  return { companies, meta }
}

export const getCompany = async ({ code }: { code: number }) => {
  const { company } = await api.getCompany({ code })
  return company
}

export const getMarket = async ({ id }: { id: number }) => {
  const { market } = await api.getMarket({ id })
  return market
}

export const getMarkets = async () => {
  const { markets } = await api.listMarkets()
  return markets
}

export const getIndustry = async ({ id }: { id: number }) => {
  const { industry } = await api.getIndustry({ id })
  return industry
}

export const getIndustries = async () => {
  const { industries } = await api.listIndustries()
  return industries
}
