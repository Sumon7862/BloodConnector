import { isDonationEligible, parseEligibleAt } from './eligibility.js'

export function normalizePhoneDigits(value) {
  let digits = String(value || '').replace(/\D/g, '')
  if (digits.startsWith('880')) digits = digits.slice(3)
  if (digits.startsWith('0')) digits = digits.slice(1)
  return digits
}

export function donorIsAvailable(donor, now = Date.now()) {
  const until = donor.nextEligibleAt || parseEligibleAt(donor.nextEligible)
  return isDonationEligible(until, now)
}

export function filterDonors(donors, query = {}) {
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

    if (availability === 'available' && !donorIsAvailable(donor, query.now)) return false
    if (availability === 'unavailable' && donorIsAvailable(donor, query.now)) return false

    return true
  })
}

export function readDonorFilters(params) {
  return {
    q: params.get('q') || '',
    area: params.get('area') || params.get('city') || '',
    bloodType: params.get('bloodType') || '',
    availability: params.get('availability') || '',
  }
}

export function donorFiltersToParams({ q, area, bloodType, availability }) {
  const next = new URLSearchParams()
  if (q) next.set('q', q)
  if (area) next.set('area', area)
  if (bloodType) next.set('bloodType', bloodType)
  if (availability) next.set('availability', availability)
  return next
}
