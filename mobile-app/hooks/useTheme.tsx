import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Appearance } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { darkColors, lightColors, type ThemeColors, type ThemeScheme } from '../constants/theme'

const KEY = 'bloodconnector-theme'

type ThemeValue = {
  scheme: ThemeScheme
  isDark: boolean
  ready: boolean
  colors: ThemeColors
  setScheme: (scheme: ThemeScheme) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [scheme, setSchemeState] = useState<ThemeScheme>('light')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    SecureStore.getItemAsync(KEY)
      .then((stored) => {
        if (stored === 'dark' || stored === 'light') setSchemeState(stored)
      })
      .finally(() => setReady(true))
  }, [])

  const setScheme = useCallback((next: ThemeScheme) => {
    setSchemeState(next)
    Appearance.setColorScheme?.(next)
    SecureStore.setItemAsync(KEY, next).catch(() => {})
  }, [])

  const value = useMemo<ThemeValue>(
    () => ({
      scheme,
      isDark: scheme === 'dark',
      ready,
      colors: scheme === 'dark' ? darkColors : lightColors,
      setScheme,
      toggle: () => setScheme(scheme === 'dark' ? 'light' : 'dark'),
    }),
    [scheme, ready, setScheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
