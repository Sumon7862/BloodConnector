import { api } from '../lib/api.js'

export const DOCTOR_HERO_COPY =
  'Volunteer doctors support patients who need blood and donors who are about to give it. Call for eligibility, recovery, or emergency advice — at no charge.'

export const DOCTORS = [
  {
    id: 'nihal-bin-rashid',
    name: 'ডাঃ নিহাল বিন রশিদ (তাহী)',
    summary: 'এমবিবিএস, বিসিএস (স্বাস্থ্য)\nমেডিসিন বিশেষজ্ঞ\nকুমিল্লা মেডিকেল কলেজ হাসপাতাল',
    qualifications: 'এমবিবিএস, বিসিএস (স্বাস্থ্য), এফসিপিএস (মেডিসিন) — কুমিল্লা মেডিকেল কলেজ হাসপাতাল',
    specialization: 'মেডিসিন, হৃদরোগ ও উচ্চ রক্তচাপ বিষয়ে অভিজ্ঞ চিকিৎসক',
    hospital: 'চেম্বার :- কুমিল্লা মেডিকেল কলেজ হাসপাতাল, কুমিল্লা সকাল ৯টা হতে দুপুর ২টা পর্যন্ত বিকাল ৪টা থেকে রাত ৮টা পর্যন্ত',
    phone: '+8801712002001',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'shimul-chandra-shil',
    name: 'শিমুল চন্দ্র শীল',
    summary: 'ডি.এম.এফ (ঢাকা)\nএম.পি.এইচ- বাংলাদেশ শিশু হাসপাতাল\nএন্ড ইন্সটিটিউট (ঢাকা)',
    qualifications: 'ডি.এম.এফ (ঢাকা) এম.পি.এইচ- বাংলাদেশ শিশু হাসপাতাল এন্ড ইন্সটিটিউট (ঢাকা)',
    specialization: 'মেডিসিন, ডায়াবেটিস ও শিশু, কিশোর রোগে অভিজ্ঞ চিকিৎসক',
    hospital: 'চেম্বার :-মায়া ফার্মেসী, মক্করপুর বাজার, নাঙ্গলকোট, কুমিল্লা সকাল ৯টা হতে দুপুর ২টা পর্যন্ত বিকাল ৪টা থেকে রাত ৮টা পর্যন্ত',
    phone: '+8801712002002',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'prashanta-roy',
    name: 'PRASHANTA ROY',
    summary: 'Medical Technologist (Pathology),\nDiploma in Pathology (PRISMET, Rangpur),\nBSc in Pathology (RU) FT- Rangpur.',
    qualifications: 'Medical Technologist (Pathology), Diploma in Pathology (PRISMET, Rangpur), BSc in Pathology (RU) FT- Rangpur.',
    specialization: 'Pathology, laboratory diagnostics, and emergency blood screening support',
    hospital: 'Chamber: Rangpur Pathology Center — morning 9:00 AM to 2:00 PM, evening 4:00 PM to 8:00 PM',
    phone: '+8801712002003',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80',
  },
]

export function getDoctor(id) {
  return DOCTORS.find((doctor) => doctor.id === id)
}

export async function fetchDoctors() {
  try {
    return await api('/doctors', { auth: false })
  } catch {
    return DOCTORS
  }
}

export async function fetchDoctor(id) {
  try {
    return await api(`/doctors/${encodeURIComponent(id)}`, { auth: false })
  } catch {
    return getDoctor(id) || null
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
