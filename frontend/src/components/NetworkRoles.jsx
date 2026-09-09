import { Link } from 'react-router-dom'
import { cardClass, cardHover } from '../lib/classes.js'
import { useAuth } from '../context/AuthContext.jsx'

const ROLES = [
  {
    id: 'request',
    kicker: 'Need blood',
    title: 'Request blood',
    copy: 'Post a request with your blood type and location. Matching donors see it instantly.',
    guestTo: '/requests',
    authTo: '/dashboard/request-blood',
    cta: 'Request blood',
  },
  {
    id: 'donate',
    kicker: 'Give blood',
    title: 'Donate blood',
    copy: 'Stay eligible, answer matching requests, and help someone who needs your group today.',
    guestTo: '/donors',
    authTo: '/dashboard/open-requests',
    cta: 'Find who needs you',
  },
]

export default function NetworkRoles() {
  const { isLoggedIn } = useAuth()

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {ROLES.map((role, index) => (
        <article key={role.id} className={`${cardClass} ${cardHover} p-6`}>
          <p className="m-0 text-[11px] font-bold tracking-[0.2em] text-brand uppercase">
            0{index + 1} · {role.kicker}
          </p>
          <h3 className="mt-3 mb-2 text-xl font-extrabold">{role.title}</h3>
          <p className="m-0 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{role.copy}</p>
          <Link
            to={isLoggedIn ? role.authTo : role.guestTo}
            className="mt-5 inline-flex text-sm font-bold text-brand no-underline hover:underline"
          >
            {role.cta} →
          </Link>
        </article>
      ))}
    </div>
  )
}
