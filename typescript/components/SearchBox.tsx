import { ChangeEventHandler, MouseEventHandler } from "react"

export default function SearchBox({ query, handleQuery, handleSearch }: { query: string, handleQuery:  ChangeEventHandler<HTMLInputElement> ,handleSearch: MouseEventHandler<HTMLButtonElement> }) {
  return (
    <div className="form-control py-3">
      <div className="join flex justify-center">
        <input type="text" placeholder="社名 または 証券コード" className="join-item input input-accent input-bordered w-3/5" value={query} onChange={handleQuery} />
        <button className="join-item btn btn-accent btn-square" onClick={handleSearch}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
      </div>
    </div>
  )
}
