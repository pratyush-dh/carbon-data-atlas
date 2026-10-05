import { useEffect, useState } from 'react'

const KEY = 'carbon-atlas-theme'

const systemDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches
const current = () => document.documentElement.getAttribute('data-theme') || (systemDark() ? 'dark' : 'light')

export default function ThemeToggle() {
  const [theme, setTheme] = useState(current)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const flip = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try { localStorage.setItem(KEY, next) } catch { /* storage blocked */ }
  }

  return (
    <button className="theme" onClick={flip} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title="Toggle light / dark">
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  )
}
