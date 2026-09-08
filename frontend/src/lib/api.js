const API_BASE = String(import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')
const TOKEN_KEY = 'bloodconnector-token'
const AUTH_EXPIRED = 'bloodconnector-auth-expired'

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (auth && token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (res.status === 401 && auth) {
    setToken('')
    window.dispatchEvent(new Event(AUTH_EXPIRED))
  }
  if (!res.ok) {
    const error = new Error(data.error || 'Request failed.')
    error.status = res.status
    error.data = data
    throw error
  }
  return data
}
