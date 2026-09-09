import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getToken, setToken } from '../services/api'
import * as authService from '../services/authService'
import { updateMe } from '../services/userService'
import type { User } from '../types'

type AuthValue = {
  user: User | null
  ready: boolean
  isLoggedIn: boolean
  hasPassword: boolean
  register: (body: Record<string, unknown>) => Promise<{ ok: boolean; error?: string; user?: User }>
  login: (emailOrPhone: string, password: string) => Promise<{ ok: boolean; error?: string }>
  updateUser: (patch: Record<string, unknown>) => Promise<User>
  changePassword: (current: string, next: string) => Promise<{ ok: boolean; error?: string }>
  resetPassword: (emailOrPhone: string, next: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  const refresh = useCallback(async () => {
    const token = await getToken()
    if (!token) {
      setUser(null)
      setReady(true)
      return
    }
    try {
      const next = await authService.fetchMe()
      if (next.role === 'admin') {
        await setToken('')
        setUser(null)
      } else {
        setUser(next)
      }
    } catch {
      await setToken('')
      setUser(null)
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo<AuthValue>(
    () => ({
      user,
      ready,
      isLoggedIn: Boolean(user),
      hasPassword: Boolean(user?.hasPassword),
      async register(body) {
        try {
          const result = await authService.register(body)
          if (!result.ok) return { ok: false, error: result.error }
          setUser(result.user)
          return { ok: true, user: result.user }
        } catch (error) {
          return { ok: false, error: error instanceof Error ? error.message : 'Could not create account.' }
        }
      },
      async login(emailOrPhone, password) {
        try {
          const result = await authService.login(emailOrPhone, password)
          if (!result.ok) return { ok: false, error: result.error }
          setUser(result.user)
          return { ok: true }
        } catch (error) {
          return { ok: false, error: error instanceof Error ? error.message : 'Could not sign in.' }
        }
      },
      async updateUser(patch) {
        const next = await updateMe(patch)
        setUser(next)
        return next
      },
      async changePassword(current, next) {
        try {
          await authService.changePassword(current, next)
          setUser((currentUser) => (currentUser ? { ...currentUser, hasPassword: true } : currentUser))
          return { ok: true }
        } catch (error) {
          return { ok: false, error: error instanceof Error ? error.message : 'Could not update password.' }
        }
      },
      async resetPassword(emailOrPhone, next) {
        try {
          await authService.resetPassword(emailOrPhone, next)
          return { ok: true }
        } catch (error) {
          return { ok: false, error: error instanceof Error ? error.message : 'Could not reset password.' }
        }
      },
      async logout() {
        await authService.logout()
        setUser(null)
      },
      refresh,
    }),
    [user, ready, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
