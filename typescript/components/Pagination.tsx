import Link from 'next/link'
import { UrlObject } from 'url'

export default function Pagination({ prevRef, nextRef, page, prev, next }: {  prevRef: UrlObject, nextRef: object, page: number, prev: number | null, next: number | null}) {

  return (
    <div className="py-3">
      <div className="flex items-center justify-center">
        <div className="join">
          <button className="join-item btn btn-outline btn-accent" disabled={prev === null}>
            <Link href={prevRef} prefetch={false}>前のページ</Link>
          </button>
          <button className="join-item btn btn-outline btn-accent" disabled={next === null}>
            <Link href={nextRef} prefetch={false}>次のページ</Link>
          </button>
        </div>
      </div>
    </div>
  )
}
