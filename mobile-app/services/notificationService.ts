import { api } from './api'
import type { AppNotification } from '../types'

export async function loadNotifications() {
  try {
    const list = await api<AppNotification[]>('/notifications')
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export async function saveNotifications(notes: AppNotification[]) {
  return api<AppNotification[]>('/notifications', { method: 'PUT', body: notes })
}
