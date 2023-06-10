export const numberWithDelimiter = (number: Number | null): string => {
  if (typeof number === 'number' && number !== 0) {
    return number.toLocaleString()
  } else {
    return '-'
  }
}

export const divide_1_000 = (number: Number | null): number => {
  if (typeof number === 'number') {
    return Math.round(number / 1_000)
  } else {
    return 0
  }
}

export const divide_1_000_000 = (number: Number | null): number => {
  if (typeof number === 'number') {
    return Math.round(number / 1_000_000)
  } else {
    return 0
  }
}

export const isNegative = (number: Number | null): boolean => {
  if (typeof number === 'number') {
    return number < 0
  } else {
    return false
  }
}

type ProfitColor = 'red' | 'inherit'
export const profitColor = (number: Number | null): ProfitColor => {
  return isNegative(number) ? 'red' : 'inherit'
}

// export const isMobile = window.innerWidth < 576
