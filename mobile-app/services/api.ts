import * as SecureStore from 'expo-secure-store'
import { API_URL } from '../config/env'

const TOKEN_KEY = 'bloodconnector-token'

type ApiOptions = {
  method?: string
  body?: unknown
  auth?: boolean
}

export async function getToken() {
  try {
    return (await SecureStore.getItemAsync(TOKEN_KEY)) || ''
  } catch {
    return ''
  }
}

export async function setToken(token: string) {
  try {
    if (token) await SecureStore.setItemAsync(TOKEN_KEY, token)
    else await SecureStore.deleteItemAsync(TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function api<T = unknown>(path: string, { method = 'GET', body, auth = true }: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = await getToken()
  if (auth && token) headers.Authorization = `Bearer ${token}`
  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Network error. Check your connection and try again.', 0)
  }
  const data = (await res.json().catch(() => ({}))) as { error?: string }
  if (res.status === 401 && auth && token) await setToken('')
  if (!res.ok) throw new ApiError(data.error || 'Request failed.', res.status)
  return data as T
}
