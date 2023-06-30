import 'server-only'

const dictionaries = {
  ja: () => import('@/dictionaries/ja.json').then((module) => module.default),
}

export const getDictionary = async (locale: string) => dictionaries[locale as keyof typeof dictionaries]()
