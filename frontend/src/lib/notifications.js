import { api } from './api.js'

export async function loadNotifications() {
  try {
    return await api('/notifications')
  } catch {
    return []
  }
}

export async function saveNotifications(notes) {
  return api('/notifications', { method: 'PUT', body: notes })
}
