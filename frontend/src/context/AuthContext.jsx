import { createContext, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'bloodconnector-user'
const ACCOUNTS_KEY = 'bloodconnector-accounts'
const AuthContext = createContext(null)

function readUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function readAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '{}')
  } catch {
    return {}
  }
}

function accountKey(emailOrPhone) {
  return String(emailOrPhone || '').trim().toLowerCase()
}

function normalizeUser(input = {}, previous = null) {
  const role = input.role || previous?.role || 'donor'
  return {
    name: input.fullName || input.name || previous?.name || 'Member',
    emailOrPhone: input.emailOrPhone ?? previous?.emailOrPhone ?? '',
    bloodGroup: input.bloodGroup || previous?.bloodGroup || '',
    age: input.age ?? previous?.age ?? '',
    role: role === 'doctor' ? 'doctor' : 'donor',
    address: input.address ?? previous?.address ?? '',
    photo: input.photo ?? previous?.photo ?? '',
  }
}

function persistUser(user) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    if (user.emailOrPhone) {
      const accounts = readAccounts()
      accounts[accountKey(user.emailOrPhone)] = user
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
    }
  } catch {
    /* ignore quota / private mode */
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null
    const raw = readUser()
    if (!raw) return null
    const next = normalizeUser(raw, raw)
    persistUser(next)
    return next
  })

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      login(nextUser) {
        const saved = readAccounts()[accountKey(nextUser.emailOrPhone)] || null
        const next = normalizeUser(nextUser, saved)
        persistUser(next)
        setUser(next)
      },
      updateUser(patch) {
        const next = normalizeUser({ ...user, ...patch }, user)
        persistUser(next)
        setUser(next)
      },
      logout() {
        try {
          localStorage.removeItem(STORAGE_KEY)
        } catch {
          /* ignore */
        }
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
