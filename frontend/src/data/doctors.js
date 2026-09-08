import { api } from '../lib/api.js'

export const DOCTOR_HERO_COPY =
  'Volunteer doctors support patients who need blood and donors who are about to give it. Call for eligibility, recovery, or emergency advice — at no charge.'

export async function fetchDoctors() {
  try {
    return await api('/doctors', { auth: false })
  } catch {
    return []
  }
}

export async function fetchDoctor(id) {
  try {
    return await api(`/doctors/${encodeURIComponent(id)}`, { auth: false })
  } catch {
    return null
  }
}

export async function getDoctorReviews(id) {
  try {
    return await api(`/doctors/${encodeURIComponent(id)}/reviews`, { auth: false })
  } catch {
    return []
  }
}

export async function addDoctorReview(id, review) {
  return api(`/doctors/${encodeURIComponent(id)}/reviews`, { method: 'POST', body: review, auth: false })
}
