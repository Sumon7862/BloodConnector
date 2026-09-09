import { useEffect, useState } from 'react'
import { BLOOD_COMPAT } from '../data/dashboardData.js'
import { accountKey } from './user.js'
import { api } from './api.js'

export const REQUESTS_EVENT = 'bloodconnector-requests'

const URGENCY_RANK = { Critical: 0, High: 1, Regular: 2 }

function emit() {
  window.dispatchEvent(new Event(REQUESTS_EVENT))
}

export function sortRequests(list) {
  return [...list].sort((a, b) => {
    const urgency = (URGENCY_RANK[a.urgency] ?? 9) - (URGENCY_RANK[b.urgency] ?? 9)
    if (urgency) return urgency
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
}

export function openRequests(list = []) {
  return sortRequests(list.filter((item) => item.status === 'open'))
}

export function canDonateTo(donorType, neededType) {
  if (!donorType || !neededType) return false
  const row = BLOOD_COMPAT.find((item) => item.type === donorType)
  if (!row) return false
  if (row.donate === 'All') return true
  return row.donate.split(',').map((part) => part.trim()).includes(neededType)
}

export function matchesBloodGroup(userGroup, neededType) {
  return Boolean(userGroup && neededType && userGroup === neededType)
}

export function matchingRequestsFor(user, list = []) {
  const myId = userIdFrom(user)
  return openRequests(list).filter((item) => {
    if (item.requesterId === myId) return false
    if (!matchesBloodGroup(user?.bloodGroup, item.bloodType)) return false
    if (item.dismissed) return false
    return !(item.dismissedBy || []).includes(myId)
  })
}

export function formatRequestTime(iso) {
  const start = new Date(iso).getTime()
  if (!Number.isFinite(start)) return ''
  const diff = Date.now() - start
  if (diff < 60_000) return 'Just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} hr ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function userIdFrom(user) {
  return user?.id || accountKey(user?.emailOrPhone)
}

export async function loadRequests() {
  try {
    return await api('/requests')
  } catch {
    return []
  }
}

export async function createBloodRequest(_user, form) {
  const request = await api('/requests', { method: 'POST', body: form })
  emit()
  return request
}

export async function respondToRequest(requestId, _donor, { message, phone }) {
  const request = await api(`/requests/${requestId}/respond`, { method: 'POST', body: { message, phone } })
  emit()
  return request
}

export async function setResponseStatus(requestId, responseId, status) {
  const request = await api(`/requests/${requestId}/responses/${responseId}`, { method: 'POST', body: { status } })
  emit()
  return request
}

export async function contactRequester(requestId) {
  const request = await api(`/requests/${requestId}/contact`, { method: 'POST' })
  emit()
  return request
}

export async function dismissRequest(requestId) {
  const request = await api(`/requests/${requestId}/dismiss`, { method: 'POST' })
  emit()
  return request
}

export async function closeRequest(requestId, _actor, status = 'closed') {
  const request = await api(`/requests/${requestId}/close`, { method: 'POST', body: { status } })
  emit()
  return request
}

export function useRequests() {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    let cancelled = false
    async function refresh() {
      const list = await loadRequests()
      if (!cancelled) setRequests(list)
    }
    refresh()
    window.addEventListener(REQUESTS_EVENT, refresh)
    return () => {
      cancelled = true
      window.removeEventListener(REQUESTS_EVENT, refresh)
    }
  }, [])

  return requests
}
