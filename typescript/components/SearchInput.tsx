"use client"

import { useState, ChangeEventHandler } from "react"
import Link from "next/link"
import { useCreateQueryString } from "@/hooks/CreateQueryString"
import { usePathname } from "next/navigation"

export default function SearchInput({
  query,
  isCompanies = false,
  dict,
}: {
  query: string
  isCompanies?: boolean
  dict: {
    placeholder: string
  }
}) {
  const createQueryString = useCreateQueryString()
  const [changedQuery, setQuery] = useState(query)
  const handleQuery: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setQuery(target.value)
  }
  let pathname: string
  pathname = usePathname()
  if (isCompanies) {
    pathname = "/companies"
  }

  return (
    <fieldset className='form-control py-3'>
      <div className='join flex justify-center'>
        <input
          type='text'
          placeholder={dict.placeholder}
          className='join-item input input-accent w-3/5'
          value={changedQuery}
          onChange={handleQuery}
        />
        <Link
          href={pathname + "?" + createQueryString("q", changedQuery)}
          className='join-item btn btn-accent btn-square'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </Link>
      </div>
    </fieldset>
  )
}
