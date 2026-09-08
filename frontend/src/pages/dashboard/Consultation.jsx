import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashPageHead from '../../components/DashPageHead.jsx'
import { Icon } from '../../components/DashIcons.jsx'
import DoctorCard from '../../components/DoctorCard.jsx'
import { cardClass } from '../../lib/classes.js'
import { fetchDoctors } from '../../data/doctors.js'
import { useAuth } from '../../context/AuthContext.jsx'

const TYPES = [
  { id: 'phone', title: 'Phone', copy: 'Quick eligibility or emergency advice.', action: 'Call desk', icon: 'phone' },
  { id: 'video', title: 'Video', copy: 'Face-to-face recovery guidance.', action: 'Start video', icon: 'video' },
  { id: 'chat', title: 'Chat', copy: 'Send a short question anytime.', action: 'Start chat', icon: 'chat' },
]

export default function Consultation() {
  const { user } = useAuth()
  const isDoctor = user?.role === 'doctor'
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    document.title = 'BloodConnector — Consultation'
  }, [])

  useEffect(() => {
    let cancelled = false
    fetchDoctors().then((list) => { if (!cancelled) setDoctors(list) })
    return () => { cancelled = true }
  }, [])

  return (
    <div>
      <DashPageHead
        title={isDoctor ? 'Consultation desk' : 'Consult a doctor'}
        subtitle={
          isDoctor
            ? 'Patients and donors can reach you for free advice while a match is underway.'
            : 'Before you donate or while you wait for blood, talk to a volunteer doctor at no charge.'
        }
      />

      <section className="overflow-hidden rounded-2xl bg-navy p-5 text-white sm:p-7">
        <p className="m-0 text-[11px] font-bold tracking-[0.2em] text-white/70 uppercase">
          {isDoctor ? 'You help both sides' : 'Free for members'}
        </p>
        <h2 className="mt-2 mb-0 text-2xl font-extrabold text-white">
          {isDoctor ? 'Keep your line open' : 'Donors and patients share this desk'}
        </h2>
        <p className="mt-2 mb-0 max-w-2xl text-sm leading-relaxed text-white/85">
          {isDoctor
            ? 'Update your hospital and phone in Profile so matching members can reach you during a request.'
            : 'Ask about eligibility, recovery, or what to do until a matching donor arrives.'}
        </p>
      </section>

      <h2 className="mt-8 mb-4 text-lg font-extrabold">How to connect</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {TYPES.map((item) => (
          <article key={item.id} className={`${cardClass} px-5 py-6 text-center`}>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand text-white">
              <Icon name={item.icon} className="h-6 w-6" />
            </span>
            <h3 className="mt-4 mb-1 text-base font-extrabold">{item.title}</h3>
            <p className="m-0 text-sm text-slate-500">{item.copy}</p>
            <a
              href="tel:+8801712002001"
              className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl bg-brand text-sm font-bold text-white no-underline hover:bg-brand-hover"
            >
              {item.action}
            </a>
          </article>
        ))}
      </div>

      <h2 className="mt-8 mb-4 text-lg font-extrabold">{isDoctor ? 'Your colleagues' : 'Available doctors'}</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
      <p className="mt-6 mb-0 text-center text-sm text-slate-500">
        Public directory:{' '}
        <Link to="/doctors" className="font-bold text-brand no-underline hover:underline">
          All doctors
        </Link>
      </p>
    </div>
  )
}
