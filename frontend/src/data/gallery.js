import { api } from '../lib/api.js'

export const OPINIONS_EVENT = 'bloodconnector-opinions'
export const MAX_OPINION_CHARS = 100

function emit() {
  window.dispatchEvent(new Event(OPINIONS_EVENT))
}

export async function loadOpinions() {
  try {
    return await api('/opinions', { auth: false })
  } catch {
    return []
  }
}

export async function findUserOpinion() {
  try {
    return await api('/opinions/me')
  } catch {
    return null
  }
}

export async function saveOpinion(opinion) {
  const list = await api('/opinions', { method: 'PUT', body: opinion })
  emit()
  return list
}

export async function deleteOpinion() {
  const list = await api('/opinions', { method: 'DELETE' })
  emit()
  return list
}

export function formatOpinionDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}
