import { DONORS } from '../data/donors.js'
import { accountKey, roleLabel } from './user.js'
import { parseEligibleAt } from './eligibility.js'

const FRIENDS_PREFIX = 'bloodconnector-friends'

export function friendsKey(user) {
  return `${FRIENDS_PREFIX}-${accountKey(user?.emailOrPhone || user?.name || 'member')}`
}

export function loadFriends(user) {
  try {
    const raw = localStorage.getItem(friendsKey(user))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveFriends(user, friends) {
  localStorage.setItem(friendsKey(user), JSON.stringify(friends))
  return friends
}

export function addKnownDonor(user, person) {
  const current = loadFriends(user)
  if (current.some((item) => item.id === person.id)) return current
  return saveFriends(user, [person, ...current])
}

export function removeKnownDonor(user, personId) {
  return saveFriends(user, loadFriends(user).filter((item) => item.id !== personId))
}

const FAMILY_PREFIX = 'bloodconnector-family'

export function familyStorageKey(user) {
  return `${FAMILY_PREFIX}-${accountKey(user?.emailOrPhone || user?.name || 'member')}`
}

export function loadFamily(user, seed = []) {
  try {
    const raw = localStorage.getItem(familyStorageKey(user))
    return raw ? JSON.parse(raw) : seed
  } catch {
    return seed
  }
}

export function saveFamily(user, family) {
  localStorage.setItem(familyStorageKey(user), JSON.stringify(family))
  return family
}

function digits(value) {
  return String(value || '').replace(/\D/g, '')
}

export function personId(person) {
  return person.id
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

export function accountToPerson(account) {
  return {
    id: `account:${accountKey(account.emailOrPhone)}`,
    donorId: '',
    name: account.name,
    bloodType: account.bloodGroup || '',
    phone: account.phone || (String(account.emailOrPhone || '').includes('@') ? '' : account.emailOrPhone),
    email: account.email || (String(account.emailOrPhone || '').includes('@') ? account.emailOrPhone : ''),
    location: account.address || '',
    photo: account.photo || '',
    role: roleLabel(account.role),
    available: account.available !== false,
    nextEligibleAt: account.nextEligibleAt || parseEligibleAt(account.nextEligible),
  }
}

function mergeKey(person) {
  const phone = digits(person.phone)
  if (phone.length >= 10) return `tel:${phone}`
  if (person.email) return `mail:${String(person.email).toLowerCase()}`
  return person.id
}

export function buildDirectory(members, self) {
  const selfKey = accountKey(self?.emailOrPhone)
  const selfPhone = digits(self?.phone || self?.emailOrPhone)
  const fromDonors = DONORS.map(toDirectoryPerson)
  const fromAccounts = (members || [])
    .filter((account) => accountKey(account.emailOrPhone) !== selfKey)
    .map(accountToPerson)

  const map = new Map()
  fromDonors.forEach((person) => map.set(mergeKey(person), person))
  fromAccounts.forEach((person) => map.set(mergeKey(person), person))

  return [...map.values()].filter((person) => {
    const phone = digits(person.phone)
    if (selfPhone.length >= 10 && phone === selfPhone) return false
    return true
  })
}

export function searchPeople(people, query, bloodType = '') {
  const q = String(query || '').trim().toLowerCase()
  const type = String(bloodType || '').trim()
  return people.filter((person) => {
    const typeOk = !type || person.bloodType === type
    if (!typeOk) return false
    if (!q) return true
    return (
      person.name.toLowerCase().includes(q) ||
      person.location.toLowerCase().includes(q) ||
      person.phone.toLowerCase().includes(q) ||
      person.email.toLowerCase().includes(q) ||
      person.bloodType.toLowerCase() === q ||
      person.role.toLowerCase().includes(q)
    )
  })
}
