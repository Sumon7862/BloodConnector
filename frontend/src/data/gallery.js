import { api } from '../lib/api.js'

export const SEED_OPINIONS = [
  {
    id: 'seed-1',
    name: 'Ayesha Rahman',
    role: 'Donor',
    location: 'Dhanmondi, Dhaka',
    rating: 5,
    opinion:
      'I found a matching donor within an hour during an emergency. BloodConnector made a terrifying night feel manageable.',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    createdAt: '2026-08-12T10:00:00.000Z',
  },
  {
    id: 'seed-2',
    name: 'Rahim Uddin',
    role: 'Donor',
    location: 'Gulshan, Dhaka',
    rating: 5,
    opinion:
      'The verified donor list and live blood-bank units helped my family skip guesswork. We reached the right hospital faster.',
    photo: 'https://randomuser.me/api/portraits/men/11.jpg',
    createdAt: '2026-08-20T14:20:00.000Z',
  },
  {
    id: 'seed-3',
    name: 'Nusrat Jahan',
    role: 'Doctor',
    location: 'Mirpur, Dhaka',
    rating: 4,
    opinion:
      'Coordinating donors used to take all night. Now I can share this platform and people actually get through to help.',
    photo: 'https://randomuser.me/api/portraits/women/65.jpg',
    createdAt: '2026-08-28T09:15:00.000Z',
  },
  {
    id: 'seed-4',
    name: 'Faruk Hossain',
    role: 'Donor',
    location: 'Uttara, Dhaka',
    rating: 5,
    opinion:
      'Simple, honest, and local. I donate when I am eligible and the reminders keep me on track without spam.',
    photo: 'https://randomuser.me/api/portraits/men/75.jpg',
    createdAt: '2026-09-01T18:40:00.000Z',
  },
  {
    id: 'seed-5',
    name: 'Sadia Akter',
    role: 'Doctor',
    location: 'Banani, Dhaka',
    rating: 5,
    opinion:
      'The free doctor service gave us calm advice while we waited for blood. That phone call mattered as much as the donation.',
    photo: 'https://randomuser.me/api/portraits/women/21.jpg',
    createdAt: '2026-09-03T11:05:00.000Z',
  },
  {
    id: 'seed-6',
    name: 'Tanvir Ahmed',
    role: 'Donor',
    location: 'Kazipara, Mirpur',
    rating: 4,
    opinion:
      'Seeing other donors’ stories in one place made me sign up. The community feels real, not like a distant app.',
    photo: 'https://randomuser.me/api/portraits/men/45.jpg',
    createdAt: '2026-09-06T16:30:00.000Z',
  },
]

export const OPINIONS_EVENT = 'bloodconnector-opinions'
export const MAX_OPINION_CHARS = 100

function emit() {
  window.dispatchEvent(new Event(OPINIONS_EVENT))
}

export async function loadOpinions() {
  try {
    return await api('/opinions', { auth: false })
  } catch {
    return SEED_OPINIONS
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
