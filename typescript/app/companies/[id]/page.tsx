export default async function Page({ params }: {
  params: {id: string}
}) {
  const company = await getCompany(params.id)
  return (

    <ul className="flex flex-col items-center justify-center min-h-screen py-2">
      <li>This is params.id {params.id}</li>
      <li>This is compamy.company_name  {company.company_name} </li>
    </ul>
  )
}

const getCompany = async (id: string) => {
  const API_HOST_BASE_URL = process.env.API_HOST_BASE_URL
  const res = await fetch(`${API_HOST_BASE_URL}/api/v1/companies/${id}`)
  const { company } = await res.json()
  return company
}
