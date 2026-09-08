import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'bloodconnector-theme'
const ThemeContext = createContext(null)

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function readPreference() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    /* ignore */
  }
  return 'system'
}

function applyTheme(theme) {
  const isDark = theme === 'dark'
  document.documentElement.classList.toggle('dark', isDark)
  document.documentElement.style.colorScheme = theme
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', isDark ? '#0B0D12' : '#F3F4F6')
}

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(() =>
    typeof window === 'undefined' ? 'system' : readPreference(),
  )
  const [systemTheme, setSystemTheme] = useState(() =>
    typeof window === 'undefined' ? 'light' : getSystemTheme(),
  )

  const theme = preference === 'system' ? systemTheme : preference

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = () => setSystemTheme(media.matches ? 'dark' : 'light')
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEY, preference)
    } catch {
      /* ignore */
    }
  }, [theme, preference])

  const value = useMemo(
    () => ({
      theme,
      preference,
      isDark: theme === 'dark',
      toggleTheme: () => {
        setPreference(theme === 'dark' ? 'light' : 'dark')
      },
      setTheme: setPreference,
    }),
    [theme, preference],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
