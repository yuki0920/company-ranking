import {
  DefaultApi,
  Configuration,
  ListCompaniesSortTypeEnum,
  ListCompaniesRequest,
} from "@/client"
import { NEXT_PUBLIC_API_URL } from "@/constant"

const config = new Configuration({ basePath: NEXT_PUBLIC_API_URL })
const api = new DefaultApi(config)

export const useCompanies = async ({
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

export const useMarket = async ({ id }: { id: number }) => {
  const { market } = await api.getMarket({ id })
  return market
}

export const useIndustry = async ({ id }: { id: number }) => {
  const { industry } = await api.getIndustry({ id })
  return industry
}
