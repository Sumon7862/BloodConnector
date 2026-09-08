import { Link } from 'react-router-dom'
import { cardClass, cardHover } from '../lib/classes.js'
import { useAuth } from '../context/AuthContext.jsx'

const ROLES = [
  {
    id: 'patient',
    kicker: 'Patients',
    title: 'Need blood',
    copy: 'Post a request. Matching donors see it instantly and can call you.',
    guestTo: '/requests',
    authTo: '/dashboard/request-blood',
    cta: 'Request blood',
  },
  {
    id: 'donor',
    kicker: 'Donors',
    title: 'Give blood',
    copy: 'Stay eligible, answer matching requests, and keep someone alive today.',
    guestTo: '/donors',
    authTo: '/dashboard/open-requests',
    cta: 'Help as a donor',
  },
  {
    id: 'doctor',
    kicker: 'Doctors',
    title: 'Give care',
    copy: 'Advise donors and patients on eligibility, recovery, and emergencies — free.',
    guestTo: '/doctors',
    authTo: '/dashboard/consultation',
    cta: 'Talk to a doctor',
  },
]

export default function NetworkRoles() {
  const { user, isLoggedIn } = useAuth()

  function hrefFor(role) {
    if (!isLoggedIn) return role.guestTo
    if (role.id === 'donor' && user?.role === 'doctor') return '/donors'
    if (role.id === 'doctor' && user?.role !== 'doctor') return '/doctors'
    return role.authTo
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {ROLES.map((role, index) => (
        <article key={role.id} className={`${cardClass} ${cardHover} p-6`}>
          <p className="m-0 text-[11px] font-bold tracking-[0.2em] text-brand uppercase">
            0{index + 1} · {role.kicker}
          </p>
          <h3 className="mt-3 mb-2 text-xl font-extrabold">{role.title}</h3>
          <p className="m-0 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{role.copy}</p>
          <Link
            to={hrefFor(role)}
            className="mt-5 inline-flex text-sm font-bold text-brand no-underline hover:underline"
          >
            {role.cta} →
          </Link>
        </article>
      ))}
    </div>
  )
}

