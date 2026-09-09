export type ThemeScheme = 'light' | 'dark'

export type ThemeColors = {
  brand: string
  brandHover: string
  navy: string
  navyDeep: string
  bg: string
  card: string
  muted: string
  line: string
  text: string
  success: string
  warning: string
  tabBar: string
  tabInactive: string
  header: string
  hero: string
  input: string
  inputBorder: string
}

export const lightColors: ThemeColors = {
  brand: '#e11d2d',
  brandHover: '#be123c',
  navy: '#0b2447',
  navyDeep: '#07192f',
  bg: '#f4f6fb',
  card: '#ffffff',
  muted: '#64748b',
  line: '#e8edf5',
  text: '#0f172a',
  success: '#059669',
  warning: '#d97706',
  tabBar: '#ffffff',
  tabInactive: '#8e8e93',
  header: '#07192f',
  hero: '#07192f',
  input: '#ffffff',
  inputBorder: '#e8edf5',
}

export const darkColors: ThemeColors = {
  brand: '#ff3b4a',
  brandHover: '#e11d2d',
  navy: '#f8fafc',
  navyDeep: '#000000',
  bg: '#0b0d12',
  card: '#161b22',
  muted: '#94a3b8',
  line: '#2a3340',
  text: '#f1f5f9',
  success: '#34d399',
  warning: '#fbbf24',
  tabBar: '#000000',
  tabInactive: '#9aa0a6',
  header: '#000000',
  hero: '#10141c',
  input: '#1c2128',
  inputBorder: '#2a3340',
}

export const palettes = { light: lightColors, dark: darkColors }

/** Static fallback for files that cannot hook yet */
export const colors = lightColors

export const space = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
}

export const radius = {
  sm: 12,
  md: 16,
  lg: 24,
  full: 999,
}

export const shadow = {
  card: {
    shadowColor: '#0b2447',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  tab: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
    elevation: 16,
  },
}
