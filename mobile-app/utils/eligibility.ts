export const DONATION_WAIT_DAYS = 90
const MS_DAY = 86_400_000

export function addDays(from: Date | string, days: number) {
  return new Date(new Date(from).getTime() + days * MS_DAY)
}

export function parseEligibleAt(value?: string) {
  if (!value) return ''
  const direct = new Date(value)
  if (!Number.isNaN(direct.getTime()) && /\d{4}/.test(String(value))) return direct.toISOString()
  const match = String(value).match(/(\d+)\s*day/i)
  if (!match) return ''
  return new Date(Date.now() + Number(match[1]) * MS_DAY).toISOString()
}

export function remainingParts(until?: string, now = Date.now()) {
  const end = new Date(until || '').getTime()
  if (!Number.isFinite(end)) {
    return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0, label: 'Available now' }
  }
  const ms = Math.max(0, end - now)
  const days = Math.floor(ms / MS_DAY)
  const hours = Math.floor((ms % MS_DAY) / 3_600_000)
  const minutes = Math.floor((ms % 3_600_000) / 60_000)
  const seconds = Math.floor((ms % 60_000) / 1000)
  return {
    done: ms <= 0,
    days,
    hours,
    minutes,
    seconds,
    label: ms <= 0 ? 'Available now' : `${days}d ${hours}h until eligible`,
  }
}

export function padTime(value: number) {
  return String(value).padStart(2, '0')
}

export function markDonatedNow(at = new Date()) {
  return {
    lastDonatedAt: at.toISOString(),
    nextEligibleAt: addDays(at, DONATION_WAIT_DAYS).toISOString(),
    available: false,
  }
}

export function isDonationEligible(nextEligibleAt?: string, now = Date.now()) {
  if (!nextEligibleAt) return true
  const end = new Date(nextEligibleAt).getTime()
  return !Number.isFinite(end) || end <= now
}
