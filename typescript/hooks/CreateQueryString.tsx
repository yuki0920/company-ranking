import { useCallback } from "react"
import { useSearchParams } from "next/navigation"

export function useCreateQueryString() {
  const searchParams = useSearchParams()!
  const createQueryString = useCallback(
    // https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams
    (name: string, value: string) => {
      // @ts-ignore
      const params = new URLSearchParams()
      params.set(name, value)

      return params.toString()
    },
    [],
  )

  return createQueryString
}
