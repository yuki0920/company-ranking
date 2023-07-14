export default function NumberOfResults({
  currentPage,
  lastPage,
  offsetCount,
  limitCount,
  totalCount,
  unit,
}: {
  currentPage: number
  lastPage: number
  offsetCount: number
  limitCount: number
  totalCount: number
  unit: string
}) {
  if (currentPage === lastPage) {
    return (
      <small>
        ({offsetCount} - {totalCount} / {totalCount} {unit})
      </small>
    )
  } else {
    return (
      <small>
        ({offsetCount} - {offsetCount + limitCount - 1} / {totalCount} {unit})
      </small>
    )
  }
}
