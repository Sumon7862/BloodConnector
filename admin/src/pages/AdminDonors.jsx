import { useEffect, useState } from 'react'
import DashPageHead from '../components/DashPageHead.jsx'
import BloodTypeBadge from '../components/BloodTypeBadge.jsx'
import { BLOOD_GROUPS } from '../lib/user.js'
import { btnOutline, btnPrimary, cardClass, dashInput } from '../lib/classes.js'
import { api } from '../lib/api.js'

const EMPTY = { name: '', bloodType: 'O+', location: '', city: '', area: '', phone: '', email: '', photo: '' }

export default function AdminDonors() {
  const [donors, setDonors] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'BloodConnector — Directory donors'
    api('/admin/donors')
      .then(setDonors)
      .catch((err) => {
        setDonors([])
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  async function create(event) {
    event.preventDefault()
    setError('')
    try {
      const item = await api('/admin/donors', {
        method: 'POST',
        body: {
          ...form,
          status: 'Active',
          nextEligible: 'Available now',
          nextEligibleAt: new Date().toISOString(),
          appointments: [],
          donations: [],
        },
      })
      setDonors((list) => [item, ...list])
      setForm(EMPTY)
      setOpen(false)
    } catch (err) {
      setError(err.message)
    }
  }

  async function toggle(id, hidden) {
    setError('')
    try {
      const next = await api(`/admin/donors/${id}`, { method: 'PATCH', body: { hidden } })
      setDonors((list) => list.map((item) => (item.id === id ? next : item)))
    } catch (err) {
      setError(err.message)
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this donor from the public directory?')) return
    setError('')
    try {
      await api(`/admin/donors/${id}`, { method: 'DELETE' })
      setDonors((list) => list.filter((item) => item.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <DashPageHead
        title="Directory donors"
        subtitle="These profiles appear on Home and Donors."
        action={(
          <button type="button" className={`${btnOutline} h-10 px-4`} onClick={() => setOpen((value) => !value)}>
            {open ? 'Cancel' : 'Add donor'}
          </button>
        )}
      />
      {error ? <p className="mb-4 text-sm font-medium text-brand">{error}</p> : null}
      {loading ? <p className="mb-4 text-sm text-slate-500">Loading…</p> : null}
      {open ? (
        <form className={`${cardClass} mb-5 grid gap-3 p-5 sm:grid-cols-2`} onSubmit={create}>
          <input className={dashInput} placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <select className={dashInput} value={form.bloodType} onChange={(event) => setForm({ ...form, bloodType: event.target.value })}>
            {BLOOD_GROUPS.map((type) => <option key={type}>{type}</option>)}
          </select>
          <input className={dashInput} placeholder="Location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} required />
          <input className={dashInput} placeholder="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
          <input className={dashInput} placeholder="Area" value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} />
          <input className={dashInput} placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          <input className={`${dashInput} sm:col-span-2`} placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <button type="submit" className={`${btnPrimary} sm:w-auto sm:px-8`}>Save donor</button>
        </form>
      ) : null}
      <div className="space-y-3">
        {donors.map((donor) => (
          <article key={donor.id} className={`${cardClass} flex flex-col gap-3 p-4 sm:flex-row sm:items-center`}>
            <div className="min-w-0 flex-1">
              <p className="m-0 flex flex-wrap items-center gap-2 font-extrabold">
                {donor.name}
                <BloodTypeBadge type={donor.bloodType} size="sm" />
                {donor.hidden ? <span className="text-xs font-bold text-brand uppercase">Hidden</span> : null}
              </p>
              <p className="mt-1 mb-0 text-sm text-slate-500">{donor.location}{donor.phone ? ` · ${donor.phone}` : ''}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={`${btnOutline} h-9`} onClick={() => toggle(donor.id, !donor.hidden)}>
                {donor.hidden ? 'Show' : 'Hide'}
              </button>
              <button type="button" className="h-9 px-3 text-sm font-bold text-brand" onClick={() => remove(donor.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
