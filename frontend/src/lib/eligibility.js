export const DONATION_WAIT_DAYS = 90
const MS_DAY = 86_400_000
const ELIGIBILITY_BASE = Date.parse('2026-09-08T00:00:00.000Z')

export function addDays(from, days) {
  return new Date(new Date(from).getTime() + days * MS_DAY)
}

export function parseEligibleAt(value) {
  if (!value) return ''
  const direct = new Date(value)
  if (!Number.isNaN(direct.getTime()) && /\d{4}/.test(String(value))) {
    return direct.toISOString()
  }
  const match = String(value).match(/(\d+)\s*day/i)
  if (!match) return ''
  return new Date(ELIGIBILITY_BASE + Number(match[1]) * MS_DAY).toISOString()
}

export function remainingParts(until, now = Date.now()) {
  const end = new Date(until).getTime()
  if (!Number.isFinite(end)) {
    return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0, ms: 0 }
  }
  const ms = Math.max(0, end - now)
  return {
    done: ms <= 0,
    days: Math.floor(ms / MS_DAY),
    hours: Math.floor((ms % MS_DAY) / 3_600_000),
    minutes: Math.floor((ms % 3_600_000) / 60_000),
    seconds: Math.floor((ms % 60_000) / 1000),
    ms,
  }
}

export function padTime(value) {
  return String(value).padStart(2, '0')
}

export function defaultDonorEligibility(from = new Date()) {
  const last = new Date(from.getTime() - 62 * MS_DAY)
  return {
    lastDonatedAt: last.toISOString(),
    nextEligibleAt: addDays(last, DONATION_WAIT_DAYS).toISOString(),
  }
}

export function markDonatedNow(at = new Date()) {
  return {
    lastDonatedAt: at.toISOString(),
    nextEligibleAt: addDays(at, DONATION_WAIT_DAYS).toISOString(),
    available: false,
  }
}

export function isDonationEligible(nextEligibleAt, now = Date.now()) {
  if (!nextEligibleAt) return true
  const end = new Date(nextEligibleAt).getTime()
  return !Number.isFinite(end) || end <= now
}
