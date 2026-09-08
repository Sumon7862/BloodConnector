import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, getToken, setToken } from '../lib/api.js'

const STORAGE_KEY = 'bloodconnector-user'
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
  const [secretTick, setSecretTick] = useState(0)

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
        if (data.user?.role === 'admin') {
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

  useEffect(() => {
    function onExpired() {
      cacheUser(null)
      setUser(null)
    }
    window.addEventListener('bloodconnector-auth-expired', onExpired)
    return () => window.removeEventListener('bloodconnector-auth-expired', onExpired)
  }, [])

  const value = useMemo(
    () => ({
      user,
      ready,
      isLoggedIn: Boolean(user),
      hasPassword: Boolean(user?.hasPassword),
      async register(nextUser) {
        try {
          const data = await api('/auth/register', { method: 'POST', body: nextUser, auth: false })
          if (data.user?.role === 'admin') {
            return { ok: false, adminRedirect: true, error: 'Use the admin panel to sign in.' }
          }
          setToken(data.token)
          setUser(data.user)
          cacheUser(data.user)
          return { ok: true, user: data.user }
        } catch (error) {
          return { ok: false, error: error.message }
        }
      },
      async login(nextUser) {
        try {
          const data = await api('/auth/login', { method: 'POST', body: nextUser, auth: false })
          if (data.user?.role === 'admin') {
            return { ok: false, adminRedirect: true, error: 'Use the admin panel to sign in.' }
          }
          setToken(data.token)
          setUser(data.user)
          cacheUser(data.user)
          return { ok: true, user: data.user }
        } catch (error) {
          return { ok: false, error: error.message }
        }
      },
      async updateUser(patch) {
        const data = await api('/users/me', { method: 'PATCH', body: patch })
        setUser(data.user)
        cacheUser(data.user)
        return data.user
      },
      async changePassword(currentPassword, nextPassword) {
        try {
          await api('/auth/change-password', { method: 'POST', body: { currentPassword, nextPassword } })
          setSecretTick((tick) => tick + 1)
          setUser((current) => (current ? { ...current, hasPassword: true } : current))
          return { ok: true }
        } catch (error) {
          return { ok: false, error: error.message }
        }
      },
      async resetPassword(emailOrPhone, nextPassword) {
        try {
          await api('/auth/reset-password', { method: 'POST', body: { emailOrPhone, nextPassword }, auth: false })
          return { ok: true }
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
    [user, ready, secretTick],
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
