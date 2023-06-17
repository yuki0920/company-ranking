'use client'

import { useEffect } from 'react'
import { themeChange } from 'theme-change'

export default function ThemeChangeMenu() {
  useEffect(() => {
    themeChange(false)
    // false parameter is required for react project
  }, [])

  return (
    <select data-choose-theme className="select max-w-xs">
      <option disabled selected>Theme</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  )
}
