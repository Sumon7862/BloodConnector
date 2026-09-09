import { api } from './api'
import type { Donor } from '../types'

export async function fetchDonors() {
  try {
    const list = await api<Donor[]>('/donors', { auth: false })
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export async function fetchDonor(id: string) {
  try {
    return await api<Donor>(`/donors/${encodeURIComponent(id)}`, { auth: false })
  } catch {
    return null
  }
}
