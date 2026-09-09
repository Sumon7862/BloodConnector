import { api } from './api'
import type { Donor } from '../types'

export type Person = {
  id: string
  donorId?: string
  name: string
  bloodType?: string
  phone?: string
  email?: string
  location?: string
  photo?: string
  relation?: string
}

export async function loadFriends() {
  try {
    return await api<Person[]>('/people/friends')
  } catch {
    return []
  }
}

export async function addFriend(person: Person) {
  return api<Person[]>('/people/friends', { method: 'POST', body: person })
}

export async function removeFriend(id: string) {
  return api<Person[]>(`/people/friends/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export async function loadFamily() {
  try {
    const list = await api<Person[]>('/people/family')
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export async function saveFamily(family: Person[]) {
  return api<Person[]>('/people/family', { method: 'PUT', body: family })
}

export function toDirectoryPerson(donor: Donor): Person {
  return {
    id: `donor:${donor.id}`,
    donorId: donor.id,
    name: donor.name,
    bloodType: donor.bloodType || '',
    phone: donor.phone || '',
    email: donor.email || '',
    location: donor.location || donor.area || '',
    photo: donor.photo || '',
  }
}
