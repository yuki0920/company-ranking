'use client'

import Link from 'next/link'
import { UrlObject } from 'url'

export default function Pagination({ prevRef, nextRef, page, prev, next, handlePrevPage, handleNextPage }: {  prevRef: UrlObject, nextRef: object, page: number, prev: number | null, next: number | null, handlePrevPage: () => void ,handleNextPage: () => void }) {

  return (
    <div className="py-3">
      <div className="flex items-center justify-center">
        <div className="join">
          <button
            className="join-item btn btn-outline btn-accent"
            disabled={prev === null}
            onClick={handlePrevPage}
          >
            <Link href={prevRef}>前のページ</Link>
          </button>
          <button
            className="join-item btn btn-outline btn-accent"
            disabled={next === null}
            onClick={handleNextPage}
          >
            <Link href={nextRef}>次のページ</Link>
          </button>
        </div>
      </div>
    </div>
  )
}
