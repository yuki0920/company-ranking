'use client'

import Link from 'next/link'
import { SORT_TYPES } from "@/constant"
import { useCreateQueryString } from "@/hooks/CreateQueryString"
import { usePathname } from 'next/navigation'

export default function SearchBox({ currentSortType }: { currentSortType: string }) {
  const createQueryString = useCreateQueryString()
  const pathname = usePathname()

  return (
    <div className="flex justify-center">
      <div className="flex justify-around w-3/5">
        {SORT_TYPES.map((sortType, index) => (
          <div className="flex gap-2" key={`${sortType}-${index}`} >
            <Link href={
              pathname + '?' + createQueryString('sortType', sortType.value)
            }>
              <button className={`btn btn-accent ${ currentSortType === sortType.value ? "" : "btn-outline"}`}>
                {sortType.label}
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
