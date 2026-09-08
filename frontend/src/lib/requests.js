import { useEffect, useState } from 'react'
import { BLOOD_COMPAT } from '../data/dashboardData.js'
import { accountKey } from './user.js'
import { pushNotification } from './notifications.js'

const ACCOUNTS_KEY = 'bloodconnector-accounts'

export const REQUESTS_EVENT = 'bloodconnector-requests'
export const REQUESTS_KEY = 'bloodconnector-blood-requests'

const URGENCY_RANK = { Critical: 0, High: 1, Regular: 2 }

const SEED_REQUESTS = [
  {
    id: 'seed-req-1',
    requesterId: 'seed-city-hospital',
    requesterName: 'Ayesha Rahman',
    requesterPhoto: 'https://randomuser.me/api/portraits/women/44.jpg',
    bloodType: 'O-',
    urgency: 'Critical',
    location: 'City Hospital Emergency Ward, Dhaka',
    contact: '+8801711001100',
    details: 'Trauma patient needs 2 units of O- immediately.',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    status: 'open',
    responses: [],
  },
  {
    id: 'seed-req-2',
    requesterId: 'seed-dmc',
    requesterName: 'Rahim Uddin',
    requesterPhoto: 'https://randomuser.me/api/portraits/men/11.jpg',
    bloodType: 'AB+',
    urgency: 'High',
    location: 'Dhaka Medical College Hospital',
    contact: '+8801812002200',
    details: 'Scheduled surgery tomorrow morning. Need a confirmed donor today.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    responses: [],
  },
  {
    id: 'seed-req-3',
    requesterId: 'seed-square',
    requesterName: 'Nusrat Jahan',
    requesterPhoto: 'https://randomuser.me/api/portraits/women/65.jpg',
    bloodType: 'B-',
    urgency: 'Critical',
    location: 'Square Hospital, Panthapath',
    contact: '+8801913003300',
    details: 'Post-operative bleeding. Compatible B- or O- donors welcome.',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    responses: [],
  },
]

function emit() {
  window.dispatchEvent(new Event(REQUESTS_EVENT))
}

function persist(list) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(list))
  emit()
  return list
}

export function loadRequests() {
  let stored = []
  try {
    const raw = localStorage.getItem(REQUESTS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) stored = parsed.map(normalizeRequest)
    }
  } catch {
    stored = []
  }
  const haveId = new Set(stored.map((item) => item.id))
  return [...stored, ...SEED_REQUESTS.filter((item) => !haveId.has(item.id))]
}

function normalizeRequest(item) {
  return {
    id: item.id || crypto.randomUUID(),
    requesterId: item.requesterId || 'legacy',
    requesterName: item.requesterName || 'Member',
    requesterPhoto: item.requesterPhoto || '',
    bloodType: item.bloodType || '',
    urgency: item.urgency || 'Regular',
    location: item.location || '',
    contact: item.contact || '',
    details: item.details || '',
    createdAt: item.createdAt || new Date().toISOString(),
    status: item.status || 'open',
    responses: Array.isArray(item.responses) ? item.responses : [],
    dismissedBy: Array.isArray(item.dismissedBy) ? item.dismissedBy : [],
  }
}

export function sortRequests(list) {
  return [...list].sort((a, b) => {
    const urgency = (URGENCY_RANK[a.urgency] ?? 9) - (URGENCY_RANK[b.urgency] ?? 9)
    if (urgency) return urgency
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
}

export function openRequests(list = loadRequests()) {
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

export function matchingRequestsFor(user, list = loadRequests()) {
  const myId = userIdFrom(user)
  return openRequests(list).filter((item) => {
    if (item.requesterId === myId) return false
    if (!matchesBloodGroup(user?.bloodGroup, item.bloodType)) return false
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
  return accountKey(user?.emailOrPhone)
}

export function createBloodRequest(user, form) {
  const request = normalizeRequest({
    id: crypto.randomUUID(),
    requesterId: userIdFrom(user),
    requesterName: user.name,
    requesterPhoto: user.photo || '',
    bloodType: form.bloodType,
    urgency: form.urgency,
    location: form.location.trim(),
    contact: form.contact.trim(),
    details: form.details.trim(),
    createdAt: new Date().toISOString(),
    status: 'open',
    responses: [],
  })
  const next = persist([request, ...loadRequests()])
  notifyMatchingDonors(request)
  return next
}

function notifyMatchingDonors(request) {
  let accounts = {}
  try {
    accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '{}')
  } catch {
    accounts = {}
  }
  Object.values(accounts).forEach((account) => {
    if (!account?.emailOrPhone) return
    if (accountKey(account.emailOrPhone) === request.requesterId) return
    if (!matchesBloodGroup(account.bloodGroup, request.bloodType)) return
    pushNotification(account.emailOrPhone, {
      title: `${request.bloodType} request from ${request.requesterName}`,
      message: `Needed at ${request.location}. Contact them from your dashboard, or cancel.`,
      to: '/dashboard/open-requests',
      tone: 'drop',
    })
  })
}

export function respondToRequest(requestId, donor, { message, phone }) {
  const donorId = userIdFrom(donor)
  const next = loadRequests().map((request) => {
    if (request.id !== requestId) return request
    if (request.status !== 'open') return request
    if (request.requesterId === donorId) return request
    if (request.responses.some((item) => item.donorId === donorId)) return request
    const offer = {
      id: crypto.randomUUID(),
      donorId,
      donorName: donor.name,
      donorPhoto: donor.photo || '',
      donorBloodType: donor.bloodGroup || '',
      donorPhone: String(phone || donor.phone || donor.emailOrPhone || '').trim(),
      message: String(message || '').trim(),
      createdAt: new Date().toISOString(),
      status: 'offered',
    }
    pushNotification(request.requesterId, {
      title: `${donor.name} offered to help`,
      message: `${request.bloodType} request at ${request.location}`,
      to: '/dashboard/request-blood',
      tone: 'heart',
    })
    return { ...request, responses: [offer, ...request.responses] }
  })
  return persist(next)
}

export function setResponseStatus(requestId, responseId, status, actor) {
  const actorId = userIdFrom(actor)
  const next = loadRequests().map((request) => {
    if (request.id !== requestId || request.requesterId !== actorId) return request
    const responses = request.responses.map((item) => {
      if (item.id !== responseId) {
        return status === 'accepted' && item.status === 'offered' ? { ...item, status: 'declined' } : item
      }
      return { ...item, status }
    })
    const accepted = responses.find((item) => item.id === responseId)
    if (accepted && status === 'accepted') {
      pushNotification(accepted.donorId, {
        title: 'Your offer was accepted',
        message: `${request.requesterName} accepted your help for ${request.bloodType} at ${request.location}. Call ${request.contact}.`,
        to: '/dashboard/open-requests',
        tone: 'heart',
      })
    }
    return {
      ...request,
      status: status === 'accepted' ? 'matched' : request.status,
      responses,
    }
  })
  return persist(next)
}

export function contactRequester(requestId, donor) {
  const donorId = userIdFrom(donor)
  const next = loadRequests().map((request) => {
    if (request.id !== requestId || request.status !== 'open') return request
    if (request.requesterId === donorId) return request
    if (!matchesBloodGroup(donor.bloodGroup, request.bloodType)) return request
    const already = request.responses.some((item) => item.donorId === donorId)
    if (!already) {
      pushNotification(request.requesterId, {
        title: `${donor.name} is contacting you`,
        message: `${donor.bloodGroup} donor for your ${request.bloodType} request. Number: ${donor.phone || donor.emailOrPhone || ''}`,
        to: '/dashboard/request-blood',
        tone: 'heart',
      })
    }
    const offer = already
      ? null
      : {
          id: crypto.randomUUID(),
          donorId,
          donorName: donor.name,
          donorPhoto: donor.photo || '',
          donorBloodType: donor.bloodGroup || '',
          donorPhone: String(donor.phone || donor.emailOrPhone || '').trim(),
          message: '',
          createdAt: new Date().toISOString(),
          status: 'contacted',
        }
    return offer ? { ...request, responses: [offer, ...request.responses] } : request
  })
  return persist(next)
}

export function dismissRequest(requestId, user) {
  const myId = userIdFrom(user)
  if (!myId) return loadRequests()
  const next = loadRequests().map((request) => {
    if (request.id !== requestId) return request
    if ((request.dismissedBy || []).includes(myId)) return request
    return { ...request, dismissedBy: [...(request.dismissedBy || []), myId] }
  })
  return persist(next)
}

export function closeRequest(requestId, actor, status = 'closed') {
  const actorId = userIdFrom(actor)
  const next = loadRequests().map((request) => {
    if (request.id !== requestId || request.requesterId !== actorId) return request
    return { ...request, status }
  })
  return persist(next)
}

export function useRequests() {
  const [requests, setRequests] = useState(() => loadRequests())

  useEffect(() => {
    function refresh() {
      setRequests(loadRequests())
    }
    window.addEventListener(REQUESTS_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(REQUESTS_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return requests
}
