"use client"

import { useState, useEffect } from "react"
import { themeChange } from "theme-change"

type Option = {
  value: string
  content: string
}

export default function ThemeChangeMenu() {
  const [currentSelected, setCurrentSelected] = useState("light")
  const changeSelect = (newSelect: string) => {
    setCurrentSelected(newSelect)
  }
  const options: Option[] = [
    { value: "light", content: "Light" },
    { value: "dark", content: "Dark" },
  ]

  useEffect(() => {
    themeChange(false)
    // false parameter is required for react project
  }, [])

  return (
    <select
      data-choose-theme
      className='select max-w-xs'
      onChange={(event: any) => changeSelect(event.target.value)}
      value={currentSelected}
    >
      {options.map((option: Option) => (
        <option key={option.value} value={option.value}>
          {option.content}
        </option>
      ))}
    </select>
  )
}
