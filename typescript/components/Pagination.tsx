import Link from 'next/link'
import { UrlObject } from 'url'

export default function Pagination({ prevRef, nextRef, page, prev, next }: {  prevRef: UrlObject, nextRef: object, page: number, prev: number | null, next: number | null}) {

  return (
    <div className="flex items-center justify-center">
      <div className="join">
        <button className={`join-item btn btn-sm ${prev ?? "btn-disabled"}`}>
          <Link href={prevRef}>«</Link>
        </button>
        <button className="join-item btn btn-sm">Page {page}</button>
        <button className={`join-item btn btn-sm ${next ?? "btn-disabled"}`}>
          <Link href={nextRef}>»</Link>
        </button>
      </div>
    </div>
  )
}
