export const UseUtility = () => {
  const numberWithDelimiter = (number: Number | null): any => {
    if (typeof number === 'number') {
      return number.toLocaleString()
    } else {
      return '-'
    }
  }

  return { numberWithDelimiter }
}
