import { useEffect, useState } from 'react'
import DashPageHead from '../components/DashPageHead.jsx'
import BloodTypeBadge from '../components/BloodTypeBadge.jsx'
import { btnOutline, cardClass } from '../lib/classes.js'
import { api } from '../lib/api.js'
import { roleLabel } from '../lib/user.js'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'BloodConnector — Users'
    api('/admin/users')
      .then(setUsers)
      .catch((err) => {
        setUsers([])
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  async function patch(id, body, confirmMessage) {
    if (confirmMessage && !window.confirm(confirmMessage)) return
    setError('')
    try {
      const next = await api(`/admin/users/${id}`, { method: 'PATCH', body })
      setUsers((list) => list.map((item) => (item.id === id ? next : item)))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <DashPageHead title="Users" subtitle="Verify, block, or change donor and doctor accounts." />
      {error ? <p className="mb-4 text-sm font-medium text-brand">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Loading…</p> : (
      <div className="space-y-3">
        {users.length ? users.map((user) => (
          <article key={user.id} className={`${cardClass} flex flex-col gap-3 p-4 sm:flex-row sm:items-center`}>
            <div className="min-w-0 flex-1">
              <p className="m-0 flex flex-wrap items-center gap-2 font-extrabold">
                {user.name}
                {user.bloodGroup ? <BloodTypeBadge type={user.bloodGroup} size="sm" /> : null}
                <span className="text-xs font-bold tracking-wide text-slate-400 uppercase">{roleLabel(user.role)}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  user.status === 'blocked' ? 'bg-rose-100 text-brand' : user.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'
                }`}
                >
                  {user.status}
                </span>
              </p>
              <p className="mt-1 mb-0 text-sm text-slate-500">{user.emailOrPhone}{user.address ? ` · ${user.address}` : ''}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={`${btnOutline} h-9`} onClick={() => patch(user.id, { status: 'active' })}>
                Verify
              </button>
              <button type="button" className={`${btnOutline} h-9`} onClick={() => patch(user.id, { status: 'blocked' }, `Block ${user.name}? They will not be able to log in.`)}>
                Block
              </button>
              <button
                type="button"
                className={`${btnOutline} h-9`}
                onClick={() => patch(user.id, { role: user.role === 'doctor' ? 'donor' : 'doctor' })}
              >
                Make {user.role === 'doctor' ? 'donor' : 'doctor'}
              </button>
            </div>
          </article>
        )) : (
          <p className={`${cardClass} px-5 py-10 text-center text-slate-500`}>No members yet.</p>
        )}
      </div>
      )}
    </div>
  )
}
