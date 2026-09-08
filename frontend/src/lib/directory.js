import { api } from './api.js'
import { DONORS } from '../data/donors.js'
import { BLOOD_BANKS } from '../data/homeData.js'

export async function fetchDonors() {
  try {
    return await api('/donors', { auth: false })
  } catch {
    return DONORS
  }
}

export async function fetchDonor(id) {
  try {
    return await api(`/donors/${encodeURIComponent(id)}`, { auth: false })
  } catch {
    return DONORS.find((item) => item.id === id) || null
  }
}

export async function fetchBanks() {
  try {
    return await api('/banks', { auth: false })
  } catch {
    return BLOOD_BANKS
  }
}
