import { DefaultApi, Configuration } from "@/client"
import { BASE_PATH } from "@/constant"

export default async function Page({ params }: {
  params: {id: string}
}) {
  const company = await getCompany(params.id)
  return (

    <ul className="flex flex-col items-center justify-center min-h-screen py-2">
      <li>This is params.id {params.id}</li>
      <li>This is compamy.company_name  {company.companyName} </li>
    </ul>
  )
}

const getCompany = async (id: string) => {
  const config = new Configuration({ basePath: BASE_PATH })
  const DefaultAPI = new DefaultApi(config)
  const res = await DefaultAPI.fetchCompany({code: parseInt(id, 10)})
  const { company } = res
  return company
}
