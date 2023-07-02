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
      <div className='flex items-center justify-center'>
        <div className='join'>
          <button className='join-item btn btn-outline btn-accent' disabled={prev === null}>
            <Link href={prevRef}>{dict.prev}</Link>
          </button>
          <button className='join-item btn btn-outline btn-accent' disabled={next === null}>
            <Link href={nextRef}>{dict.next}</Link>
          </button>
        </div>
      </div>
    </div>
  )
}
