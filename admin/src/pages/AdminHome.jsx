import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashPageHead from '../components/DashPageHead.jsx'
import { Icon } from '../components/DashIcons.jsx'
import { cardClass } from '../lib/classes.js'
import { api } from '../lib/api.js'

const CARDS = [
  ['users', 'Members', 'user', '/users'],
  ['openRequests', 'Open requests', 'alert', '/requests'],
  ['directoryDonors', 'Directory donors', 'people', '/donors'],
  ['directoryDoctors', 'Doctors', 'consult', '/doctors'],
  ['banks', 'Blood banks', 'drop', '/banks'],
  ['opinions', 'Opinions', 'heart', '/opinions'],
]

export default function AdminHome() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'BloodConnector — Admin'
    api('/admin/stats')
      .then(setStats)
      .catch((err) => {
        setStats(null)
        setError(err.message)
      })
  }, [])

  return (
    <div>
      <DashPageHead title="Admin overview" subtitle="Users, requests, and directories share the same API as the public app." />
      {error ? <p className="mb-4 text-sm font-medium text-brand">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CARDS.map(([key, label, icon, to]) => (
          <Link key={key} to={to} className={`${cardClass} p-5 no-underline`}>
            <p className="m-0 flex items-center gap-2 text-sm font-bold text-slate-500">
              <Icon name={icon} className="h-4.5 w-4.5 text-brand" />
              {label}
            </p>
            <p className="mt-3 mb-0 text-3xl font-extrabold">{stats ? stats[key] : '—'}</p>
          </Link>
        ))}
      </div>
      {stats ? (
        <p className="mt-6 mb-0 text-sm text-slate-500">
          {stats.donors} donors · {stats.doctors} doctors · {stats.blocked} blocked · {stats.pending} pending
        </p>
      ) : null}
    </div>
  )
}
