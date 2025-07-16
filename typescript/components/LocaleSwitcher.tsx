"use client"

import { usePathname, useRouter } from "next/navigation"
import { i18n } from "@/dictionaries/i18n-config"

export default function LocaleSwitcher() {
  // const [currentSelected, setCurrentSelected] = useState('ja')
  const pathName = usePathname()
  const router = useRouter()
  const redirectedPathName = (locale: string) => {
    if (!pathName) return "/"
    const segments = pathName.split("/")
    segments[1] = locale
    return segments.join("/")
  }

  let currentSelected = "ja"
  if (pathName) {
    const tmpLocale = pathName.split("/")[1]
    i18n.locales.forEach((locale) => {
      if (tmpLocale === locale) {
        currentSelected = locale
      }
    })
  }

  return (
    <>
      <select
        className='select-sm'
        onChange={(event: any) => {
          event.preventDefault()
          const locale = event.target.value
          router.push(redirectedPathName(locale))
        }}
        value={currentSelected}
      >
        {i18n.locales.map((locale) => {
          return (
            <option key={locale} value={locale}>
              {locale.toUpperCase()}
            </option>
          )
        })}
      </select>
    </>
  )
}
