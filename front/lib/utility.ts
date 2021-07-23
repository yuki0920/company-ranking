export const UseUtility = () => {
  const numberWithDelimiter = (number: Number | null): any => {
    if (typeof number === 'number') {
      return number.toLocaleString()
    } else {
      return '-'
    }
  }

  const isNegative = (number: Number | null): boolean => {
    if (typeof number === 'number') {
      return number < 0
    } else {
      return false
    }
  }

  const profitColor = (number: Number | null): string => {
    return isNegative(number) ? 'red' : 'inherit'
  }

  return { numberWithDelimiter, profitColor }
}
