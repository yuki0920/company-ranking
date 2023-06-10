import { DefaultApi, Configuration } from "@/client"
import { BASE_PATH } from "@/constant"

export default async function Page() {
  const companies = await getCompanies()
  return (
    <ul className="flex flex-col items-center justify-center min-h-screen">
      {companies.map(company => {
        return (
          <li key={company.securityCode}>
            code: {company.securityCode}, name: {company.securityName}
          </li>
        )
      })}
    </ul>
  )
}

const getCompanies = async () => {
  const config = new Configuration({ basePath: BASE_PATH })
  const DefaultAPI = new DefaultApi(config)
  const res = await DefaultAPI.fetchCompanies({
    sortType: "net_sales",
  })
  const { companies } = res
  return companies
}
