import { ChangeEventHandler } from "react"
import { SORT_TYPES } from "@/constant"

export default function SortButtons({ currentSortType, handleSortType }: { currentSortType: string, handleSortType: ChangeEventHandler<HTMLInputElement> }) {
  return (
    <div className="flex justify-center">
      <div className="flex justify-around w-3/5">
        {SORT_TYPES.map(sortType => (
          <>
            <div className="flex gap-2" >
              <input
                type="radio"
                name="sort-type"
                value={sortType.value}
                id={sortType.value}
                checked={currentSortType === sortType.value}
                onChange={handleSortType}
                className="radio radio-success"
              />
              <label
                htmlFor={sortType.value}
              >
                {sortType.label}
              </label>
            </div>
          </>
        ))}
      </div>
    </div>
  )
}
