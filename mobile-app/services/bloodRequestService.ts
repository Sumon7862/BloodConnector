import { api } from './api'
import type { BloodRequest } from '../types'

export async function loadRequests() {
  try {
    const list = await api<BloodRequest[]>('/requests')
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export async function createBloodRequest(form: Record<string, string>) {
  return api<BloodRequest>('/requests', { method: 'POST', body: form })
}

export async function respondToRequest(requestId: string, payload: { message?: string; phone?: string }) {
  return api<BloodRequest>(`/requests/${requestId}/respond`, { method: 'POST', body: payload })
}

export async function contactRequester(requestId: string) {
  return api<BloodRequest>(`/requests/${requestId}/contact`, { method: 'POST' })
}

export async function dismissRequest(requestId: string) {
  return api<BloodRequest>(`/requests/${requestId}/dismiss`, { method: 'POST' })
}

export async function closeRequest(requestId: string, status = 'closed') {
  return api<BloodRequest>(`/requests/${requestId}/close`, { method: 'POST', body: { status } })
}

export async function setResponseStatus(requestId: string, responseId: string, status: string) {
  return api<BloodRequest>(`/requests/${requestId}/responses/${responseId}`, { method: 'POST', body: { status } })
}
