import { useEffect, useState } from 'react'
import DashPageHead from '../components/DashPageHead.jsx'
import { btnOutline, btnPrimary, cardClass, dashInput } from '../lib/classes.js'
import { api } from '../lib/api.js'

const EMPTY = { name: '', qualifications: '', specialization: '', hospital: '', phone: '', photo: '', summary: '' }

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'BloodConnector — Directory doctors'
    api('/admin/doctors')
      .then(setDoctors)
      .catch((err) => {
        setDoctors([])
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  async function create(event) {
    event.preventDefault()
    setError('')
    try {
      const item = await api('/admin/doctors', { method: 'POST', body: form })
      setDoctors((list) => [item, ...list])
      setForm(EMPTY)
      setOpen(false)
    } catch (err) {
      setError(err.message)
    }
  }

  async function toggle(id, hidden) {
    setError('')
    try {
      const next = await api(`/admin/doctors/${id}`, { method: 'PATCH', body: { hidden } })
      setDoctors((list) => list.map((item) => (item.id === id ? next : item)))
    } catch (err) {
      setError(err.message)
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this doctor from the public directory?')) return
    setError('')
    try {
      await api(`/admin/doctors/${id}`, { method: 'DELETE' })
      setDoctors((list) => list.filter((item) => item.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <DashPageHead
        title="Directory doctors"
        subtitle="Volunteer physicians on the public Doctors page."
        action={(
          <button type="button" className={`${btnOutline} h-10 px-4`} onClick={() => setOpen((value) => !value)}>
            {open ? 'Cancel' : 'Add doctor'}
          </button>
        )}
      />
      {error ? <p className="mb-4 text-sm font-medium text-brand">{error}</p> : null}
      {loading ? <p className="mb-4 text-sm text-slate-500">Loading…</p> : null}
      {open ? (
        <form className={`${cardClass} mb-5 grid gap-3 p-5 sm:grid-cols-2`} onSubmit={create}>
          <input className={`${dashInput} sm:col-span-2`} placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <input className={`${dashInput} sm:col-span-2`} placeholder="Qualifications" value={form.qualifications} onChange={(event) => setForm({ ...form, qualifications: event.target.value })} />
          <input className={`${dashInput} sm:col-span-2`} placeholder="Specialization" value={form.specialization} onChange={(event) => setForm({ ...form, specialization: event.target.value })} />
          <input className={`${dashInput} sm:col-span-2`} placeholder="Hospital / chamber" value={form.hospital} onChange={(event) => setForm({ ...form, hospital: event.target.value })} />
          <input className={dashInput} placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          <input className={dashInput} placeholder="Photo URL" value={form.photo} onChange={(event) => setForm({ ...form, photo: event.target.value })} />
          <button type="submit" className={`${btnPrimary} sm:w-auto sm:px-8`}>Save doctor</button>
        </form>
      ) : null}
      <div className="space-y-3">
        {doctors.map((doctor) => (
          <article key={doctor.id} className={`${cardClass} flex flex-col gap-3 p-4 sm:flex-row sm:items-center`}>
            <div className="min-w-0 flex-1">
              <p className="m-0 font-extrabold">
                {doctor.name}
                {doctor.hidden ? <span className="ml-2 text-xs font-bold text-brand uppercase">Hidden</span> : null}
              </p>
              <p className="mt-1 mb-0 text-sm text-slate-500">{doctor.specialization || doctor.qualifications}</p>
              <p className="mt-1 mb-0 text-sm text-slate-500">{doctor.phone}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={`${btnOutline} h-9`} onClick={() => toggle(doctor.id, !doctor.hidden)}>
                {doctor.hidden ? 'Show' : 'Hide'}
              </button>
              <button type="button" className="h-9 px-3 text-sm font-bold text-brand" onClick={() => remove(doctor.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
