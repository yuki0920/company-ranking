import { DefaultApi, Configuration, FetchCompaniesSortTypeEnum, FetchCompaniesRequest } from "@/client"
import { NEXT_PUBLIC_API_URL } from "@/constant"

export const useCompanies = async (
  { page, sortType, q, marketId, industryId }:
  { page: number, sortType: FetchCompaniesSortTypeEnum, q: string, marketId?: number, industryId?: number }
) => {
  const config = new Configuration({ basePath: NEXT_PUBLIC_API_URL })
  const DefaultAPI = new DefaultApi(config)
  const params: FetchCompaniesRequest = { page, sortType, q }
  if (marketId !== null) params["marketId"] = marketId
  if (industryId !== null) params["industryId"] = industryId

  const { companies, meta } = await DefaultAPI.fetchCompanies(params)
  return { companies, meta }
}
