export const useUtility = () => {
  const numberWithDelimiter = (number: Number | null): string => {
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

  type ProfitColor = 'red' | 'inherit'
  const profitColor = (number: Number | null): ProfitColor => {
    return isNegative(number) ? 'red' : 'inherit'
  }

  const isMobile = window.innerWidth < 576

  return { numberWithDelimiter, profitColor, isMobile }
}
