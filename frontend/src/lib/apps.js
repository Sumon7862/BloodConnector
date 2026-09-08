export const ADMIN_APP_URL = import.meta.env.VITE_ADMIN_URL || (import.meta.env.DEV ? 'http://localhost:5174' : '')

export function openAdminApp() {
  if (!ADMIN_APP_URL) return false
  window.location.assign(ADMIN_APP_URL)
  return true
}
