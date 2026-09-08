import { accountKey } from './user.js'
import { DEFAULT_NOTIFICATIONS } from '../data/dashboardData.js'

const LEGACY_KEY = 'bloodconnector-notifications'

function notesKey(emailOrPhone) {
  return `bloodconnector-notifications:${accountKey(emailOrPhone)}`
}

export function loadNotifications(emailOrPhone) {
  if (!emailOrPhone) return []
  try {
    const raw = localStorage.getItem(notesKey(emailOrPhone))
    if (raw) {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : DEFAULT_NOTIFICATIONS
    }
  } catch {
    /* fall through */
  }
  return DEFAULT_NOTIFICATIONS
}

export function saveNotifications(emailOrPhone, notes) {
  localStorage.setItem(notesKey(emailOrPhone), JSON.stringify(notes))
  try {
    localStorage.removeItem(LEGACY_KEY)
  } catch {
    /* ignore */
  }
}

export function pushNotification(emailOrPhone, note) {
  if (!emailOrPhone) return
  const next = [
    {
      id: crypto.randomUUID(),
      unread: true,
      time: 'Just now',
      tone: 'drop',
      ...note,
    },
    ...loadNotifications(emailOrPhone),
  ]
  saveNotifications(emailOrPhone, next)
}
