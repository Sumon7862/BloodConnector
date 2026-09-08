import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, getToken, setToken } from '../lib/api.js'

const STORAGE_KEY = 'bloodconnector-admin-user'
const AuthContext = createContext(null)

function readCachedUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function cacheUser(user) {
  try {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (typeof window === 'undefined' ? null : readCachedUser()))
  const [ready, setReady] = useState(() => !getToken())

  useEffect(() => {
    const token = getToken()
    if (!token) {
      cacheUser(null)
      setUser(null)
      setReady(true)
      return undefined
    }
    let cancelled = false
    api('/auth/me')
      .then((data) => {
        if (cancelled) return
        if (data.user?.role !== 'admin') {
          setToken('')
          cacheUser(null)
          setUser(null)
          return
        }
        setUser(data.user)
        cacheUser(data.user)
      })
      .catch(() => {
        if (cancelled) return
        setToken('')
        cacheUser(null)
        setUser(null)
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      ready,
      isLoggedIn: Boolean(user),
      async login(nextUser) {
        try {
          const data = await api('/auth/login', { method: 'POST', body: nextUser, auth: false })
          if (data.user?.role !== 'admin') {
            return { ok: false, error: 'This login is only for admin accounts.' }
          }
          setToken(data.token)
          setUser(data.user)
          cacheUser(data.user)
          return { ok: true, user: data.user }
        } catch (error) {
          return { ok: false, error: error.message }
        }
      },
      logout() {
        setToken('')
        cacheUser(null)
        setUser(null)
      },
    }),
    [user, ready],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
