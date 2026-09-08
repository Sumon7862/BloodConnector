import { api } from './api.js'

export async function fetchDonors() {
  try {
    return await api('/donors', { auth: false })
  } catch {
    return []
  }
}

export async function fetchDonor(id) {
  try {
    return await api(`/donors/${encodeURIComponent(id)}`, { auth: false })
  } catch {
    return null
  }
}

export async function fetchBanks() {
  try {
    return await api('/banks', { auth: false })
  } catch {
    return []
  }
}
