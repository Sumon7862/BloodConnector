import { api, setToken } from './api'
import type { User } from '../types'

type AuthResponse = { token: string; user: User }

export async function register(body: Record<string, unknown>) {
  const data = await api<AuthResponse>('/auth/register', { method: 'POST', body, auth: false })
  if (data.user?.role === 'admin') {
    return { ok: false as const, adminRedirect: true, error: 'Use the admin panel to sign in.' }
  }
  await setToken(data.token)
  return { ok: true as const, user: data.user }
}

export async function login(emailOrPhone: string, password: string) {
  const data = await api<AuthResponse>('/auth/login', {
    method: 'POST',
    body: { emailOrPhone, password },
    auth: false,
  })
  if (data.user?.role === 'admin') {
    return { ok: false as const, adminRedirect: true, error: 'Use the admin panel to sign in.' }
  }
  await setToken(data.token)
  return { ok: true as const, user: data.user }
}

export async function fetchMe() {
  const data = await api<{ user: User }>('/auth/me')
  return data.user
}

export async function changePassword(currentPassword: string, nextPassword: string) {
  await api('/auth/change-password', { method: 'POST', body: { currentPassword, nextPassword } })
}

export async function resetPassword(emailOrPhone: string, nextPassword: string) {
  await api('/auth/reset-password', { method: 'POST', body: { emailOrPhone, nextPassword }, auth: false })
}

export async function logout() {
  await setToken('')
}
