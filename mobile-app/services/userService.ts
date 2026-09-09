import { api } from './api'
import type { User } from '../types'

export async function updateMe(patch: Partial<User> & Record<string, unknown>) {
  const data = await api<{ user: User }>('/users/me', { method: 'PATCH', body: patch })
  return data.user
}
