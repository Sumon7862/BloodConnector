import type { BloodRequest, User } from '../types'
import { accountKey } from './validation'

const URGENCY_RANK: Record<string, number> = { Critical: 0, High: 1, Regular: 2 }

export function sortRequests(list: BloodRequest[]) {
  return [...list].sort((a, b) => {
    const urgency = (URGENCY_RANK[a.urgency] ?? 9) - (URGENCY_RANK[b.urgency] ?? 9)
    if (urgency) return urgency
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

export function openRequests(list: BloodRequest[] = []) {
  return sortRequests(list.filter((item) => item.status === 'open'))
}

export function matchesBloodGroup(userGroup?: string, neededType?: string) {
  return Boolean(userGroup && neededType && userGroup === neededType)
}

export function userIdFrom(user?: User | null) {
  return user?.id || accountKey(user?.emailOrPhone)
}

export function matchingRequestsFor(user: User | null | undefined, list: BloodRequest[] = []) {
  const myId = userIdFrom(user)
  return openRequests(list).filter((item) => {
    if (item.requesterId === myId) return false
    if (!matchesBloodGroup(user?.bloodGroup, item.bloodType)) return false
    if (item.dismissed) return false
    return !(item.dismissedBy || []).includes(myId)
  })
}

export function formatRequestTime(iso?: string) {
  const start = new Date(iso || '').getTime()
  if (!Number.isFinite(start)) return ''
  const diff = Date.now() - start
  if (diff < 60_000) return 'Just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} hr ago`
  return new Date(iso || '').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
