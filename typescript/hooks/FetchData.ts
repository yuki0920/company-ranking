import {
  DefaultApi,
  Configuration,
  FetchCompaniesSortTypeEnum,
  FetchCompaniesRequest,
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
  sortType: FetchCompaniesSortTypeEnum
  q: string
  marketId?: number
  industryId?: number
}) => {
  const params: FetchCompaniesRequest = { page, sortType, q }
  if (marketId !== null) params["marketId"] = marketId
  if (industryId !== null) params["industryId"] = industryId

  const { companies, meta } = await api.fetchCompanies(params)
  return { companies, meta }
}

export const useMarket = async ({ id }: { id: number }) => {
  const { market } = await api.fetchMarket({ id })
  return market
}

export const useIndustry = async ({ id }: { id: number }) => {
  const { industry } = await api.fetchIndustry({ id })
  return industry
}
