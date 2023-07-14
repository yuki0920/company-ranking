import { ReactNode } from "react"
import Link from "next/link"

export type CrumbItem = {
  label: ReactNode
  path: string
}
export type BreadcrumbsProps = {
  items: CrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className='flex gap-2 items-start pb-2'>
      {items.map((crumb, i) => {
        const isLastItem = i === items.length - 1
        if (!isLastItem) {
          return (
            <>
              <Link href={crumb.path} key={i} className='link-text'>
                {crumb.label}
              </Link>
              {/* separator */}
              <span> / </span>
            </>
          )
        } else {
          return crumb.label
        }
      })}
    </div>
  )
}
