import { isDonationEligible, parseEligibleAt } from './eligibility'
import type { Donor } from '../types'

export function normalizePhoneDigits(value?: string) {
  let digits = String(value || '').replace(/\D/g, '')
  if (digits.startsWith('880')) digits = digits.slice(3)
  if (digits.startsWith('0')) digits = digits.slice(1)
  return digits
}

export function donorIsAvailable(donor: Donor, now = Date.now()) {
  const until = donor.nextEligibleAt || parseEligibleAt(donor.nextEligible)
  return isDonationEligible(until, now)
}

export function filterDonors(
  donors: Donor[],
  query: { q?: string; area?: string; bloodType?: string; availability?: string } = {},
) {
  const q = String(query.q || '').trim().toLowerCase()
  const qPhone = normalizePhoneDigits(query.q)
  const area = String(query.area || '').trim().toLowerCase()
  const bloodType = String(query.bloodType || '').trim()
  const availability = String(query.availability || '').trim()

  return donors.filter((donor) => {
    if (bloodType && donor.bloodType !== bloodType) return false
    if (area) {
      const haystack = `${donor.city || ''} ${donor.area || ''} ${donor.location || ''}`.toLowerCase()
      if (!haystack.includes(area)) return false
    }
    if (q) {
      const name = String(donor.name || '').toLowerCase()
      const email = String(donor.email || '').toLowerCase()
      const phone = normalizePhoneDigits(donor.phone)
      const textMatch = name.includes(q) || email.includes(q)
      const phoneMatch = qPhone.length >= 3 && phone.includes(qPhone)
      if (!textMatch && !phoneMatch) return false
    }
    if (availability === 'available' && !donorIsAvailable(donor)) return false
    if (availability === 'unavailable' && donorIsAvailable(donor)) return false
    return true
  })
}
