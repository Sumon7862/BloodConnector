import { parseEligibleAt } from './eligibility.js'
import { api } from './api.js'

export async function loadFriends() {
  try {
    return await api('/people/friends')
  } catch {
    return []
  }
}

export async function addKnownDonor(_user, person) {
  return api('/people/friends', { method: 'POST', body: person })
}

export async function removeKnownDonor(_user, personId) {
  return api(`/people/friends/${encodeURIComponent(personId)}`, { method: 'DELETE' })
}

export async function loadFamily() {
  try {
    const list = await api('/people/family')
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export async function saveFamily(_user, family) {
  return api('/people/family', { method: 'PUT', body: family })
}

export function toDirectoryPerson(donor) {
  return {
    id: `donor:${donor.id}`,
    donorId: donor.id,
    name: donor.name,
    bloodType: donor.bloodType || '',
    phone: donor.phone || '',
    email: donor.email || '',
    location: donor.location || donor.area || '',
    photo: donor.photo || '',
    role: 'Donor',
    available: donor.status !== 'Inactive',
    nextEligibleAt: donor.nextEligibleAt || parseEligibleAt(donor.nextEligible),
  }
}
