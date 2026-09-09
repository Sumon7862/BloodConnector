import { api } from './api'
import type { Opinion } from '../types'

export async function loadOpinions() {
  try {
    return await api<Opinion[]>('/opinions', { auth: false })
  } catch {
    return []
  }
}

export async function findUserOpinion() {
  try {
    return await api<Opinion | null>('/opinions/me')
  } catch {
    return null
  }
}

export async function saveOpinion(opinion: string, rating = 5) {
  return api<Opinion[]>('/opinions', { method: 'PUT', body: { opinion, rating } })
}

export async function deleteOpinion() {
  return api<Opinion[]>('/opinions', { method: 'DELETE' })
}
