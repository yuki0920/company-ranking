export const useUtility = () => {
  const numberWithDelimiter = (number: Number | null): string => {
    if (typeof number === 'number' && number !== 0) {
      return number.toLocaleString()
    } else {
      return '-'
    }
  }

  const divide_1_000 = (number: Number | null): number => {
    if (typeof number === 'number') {
      return Math.round(number / 1_000)
    } else {
      return 0
    }
  }

  const divide_1_000_000 = (number: Number | null): number => {
    if (typeof number === 'number') {
      return Math.round(number / 1_000_000)
    } else {
      return 0
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

  return { numberWithDelimiter, divide_1_000, divide_1_000_000, profitColor, isMobile }
}
