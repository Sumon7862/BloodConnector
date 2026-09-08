import { useEffect, useState } from 'react'
import DashPageHead from '../components/DashPageHead.jsx'
import BloodTypeBadge from '../components/BloodTypeBadge.jsx'
import { btnOutline, cardClass } from '../lib/classes.js'
import { api } from '../lib/api.js'

export default function AdminRequests() {
  const [requests, setRequests] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'BloodConnector — Requests'
    api('/admin/requests')
      .then(setRequests)
      .catch((err) => {
        setRequests([])
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  async function setStatus(id, status) {
    setError('')
    try {
      const next = await api(`/admin/requests/${id}`, { method: 'PATCH', body: { status } })
      setRequests((list) => list.map((item) => (item.id === id ? next : item)))
    } catch (err) {
      setError(err.message)
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this request? This cannot be undone.')) return
    setError('')
    try {
      await api(`/admin/requests/${id}`, { method: 'DELETE' })
      setRequests((list) => list.filter((item) => item.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <DashPageHead title="Blood requests" subtitle="Close spam or mark requests filled. Matching still uses exact blood group." />
      {error ? <p className="mb-4 text-sm font-medium text-brand">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Loading…</p> : (
      <div className="space-y-3">
        {requests.length ? requests.map((request) => (
          <article key={request.id} className={`${cardClass} p-4`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="m-0 flex flex-wrap items-center gap-2 font-extrabold">
                  <BloodTypeBadge type={request.bloodType} size="sm" />
                  {request.requesterName}
                  <span className="text-xs font-bold tracking-wide text-slate-400 uppercase">{request.status}</span>
                </p>
                <p className="mt-1 mb-0 text-sm text-slate-500">{request.location}</p>
                <p className="mt-1 mb-0 text-sm text-slate-600 dark:text-slate-300">{request.details}</p>
                <p className="mt-2 mb-0 text-xs text-slate-400">{request.responses?.length || 0} donor updates</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {request.status === 'open' ? (
                  <button type="button" className={`${btnOutline} h-9`} onClick={() => setStatus(request.id, 'filled')}>
                    Mark filled
                  </button>
                ) : (
                  <button type="button" className={`${btnOutline} h-9`} onClick={() => setStatus(request.id, 'open')}>
                    Reopen
                  </button>
                )}
                <button type="button" className={`${btnOutline} h-9`} onClick={() => setStatus(request.id, 'closed')}>
                  Close
                </button>
                <button type="button" className="h-9 px-3 text-sm font-bold text-brand" onClick={() => remove(request.id)}>
                  Delete
                </button>
              </div>
            </div>
          </article>
        )) : (
          <p className={`${cardClass} px-5 py-10 text-center text-slate-500`}>No requests.</p>
        )}
      </div>
      )}
    </div>
  )
}
