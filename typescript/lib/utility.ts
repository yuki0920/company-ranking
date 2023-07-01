import { ParsedUrlQueryInput } from 'querystring'

export const numberWithDelimiter = (number: Number | null): string => {
  if (typeof number === 'number' && number !== 0) {
    return number.toLocaleString()
  } else {
    return '-'
  }
}

export const percentNumber = (number: Number | null): string => {
  if (typeof number === 'number') {
    if (number > 100) return '-'

    const num = (Math.round(number * 10 * 100)) / 10
    return numberWithDelimiter(num)
  } else {
    return '-'
  }
}

export const toInt = (number: Number | null): number => {
  if (typeof number === 'number') {
    return Math.round(number)
  } else {
    return 0
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

export const formatQueryParams = (params: ParsedUrlQueryInput) => {
  const newParams = params
  for (const key in newParams) {
    if (newParams[key] === "" || newParams[key] === null) {
      delete newParams[key]
    }
  }

  return newParams
}

export const limitNameLength = (jaName :string, enName :string, lang :string, limit: number) => {
  const str = lang === 'ja' ? jaName : enName
  if (str.length > limit) {
    return str.slice(0, limit) + '...'
  } else {
    return str
  }
}
