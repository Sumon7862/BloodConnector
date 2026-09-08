import { useEffect, useState } from 'react'
import DashPageHead from '../components/DashPageHead.jsx'
import DonorAvatar from '../components/DonorAvatar.jsx'
import { btnOutline, cardClass } from '../lib/classes.js'
import { api } from '../lib/api.js'

export default function AdminOpinions() {
  const [opinions, setOpinions] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'BloodConnector — Moderate opinions'
    api('/admin/opinions')
      .then(setOpinions)
      .catch((err) => {
        setOpinions([])
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  async function toggle(id, hidden) {
    setError('')
    try {
      const next = await api(`/admin/opinions/${id}`, { method: 'PATCH', body: { hidden } })
      setOpinions((list) => list.map((item) => (item.id === id ? next : item)))
    } catch (err) {
      setError(err.message)
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this opinion?')) return
    setError('')
    try {
      await api(`/admin/opinions/${id}`, { method: 'DELETE' })
      setOpinions((list) => list.filter((item) => item.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <DashPageHead title="Opinions" subtitle="Hide or delete gallery posts. Hidden items leave the public gallery." />
      {error ? <p className="mb-4 text-sm font-medium text-brand">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Loading…</p> : (
      <div className="space-y-3">
        {opinions.length ? opinions.map((item) => (
          <article key={item.id} className={`${cardClass} p-4`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <DonorAvatar name={item.name} photo={item.photo} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="m-0 font-extrabold">
                  {item.name}
                  {item.hidden ? <span className="ml-2 text-xs font-bold text-brand uppercase">Hidden</span> : null}
                </p>
                <p className="mt-1 mb-0 text-sm text-slate-500">{item.role}{item.location ? ` · ${item.location}` : ''}</p>
                <p className="mt-2 mb-0 text-sm leading-relaxed text-slate-600 dark:text-slate-300">“{item.opinion}”</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className={`${btnOutline} h-9`} onClick={() => toggle(item.id, !item.hidden)}>
                  {item.hidden ? 'Show' : 'Hide'}
                </button>
                <button type="button" className="h-9 px-3 text-sm font-bold text-brand" onClick={() => remove(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          </article>
        )) : (
          <p className={`${cardClass} px-5 py-10 text-center text-slate-500`}>No opinions.</p>
        )}
      </div>
      )}
    </div>
  )
}
