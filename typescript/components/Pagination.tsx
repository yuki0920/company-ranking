import Link from "next/link"
import { UrlObject } from "url"

export default function Pagination({
  prevRef,
  nextRef,
  prev,
  next,
  dict,
}: {
  prevRef: UrlObject
  nextRef: object
  prev: number | null
  next: number | null
  dict: {
    prev: string
    next: string
  }
}) {
  return (
    <div className='py-3'>
      <div className='join flex items-center justify-center'>
        <Link href={prevRef} className='join-item btn btn-outline btn-accent' aria-disabled={prev === null}>
          {dict.prev}
        </Link>
        <Link href={nextRef} className='join-item btn btn-outline btn-accent' aria-disabled={next === null}>
          {dict.next}
        </Link>
      </div>
    </div>
  )
}
