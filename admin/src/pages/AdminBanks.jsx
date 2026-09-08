import { useEffect, useState } from 'react'
import DashPageHead from '../components/DashPageHead.jsx'
import { BLOOD_TYPES } from '../lib/user.js'
import { btnOutline, btnPrimary, cardClass, dashInput } from '../lib/classes.js'
import { api } from '../lib/api.js'

const EMPTY_UNITS = Object.fromEntries(BLOOD_TYPES.map((type) => [type, 0]))
const EMPTY = { name: '', distance: '', phone: '', map: '', units: { ...EMPTY_UNITS } }

export default function AdminBanks() {
  const [banks, setBanks] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'BloodConnector — Blood banks'
    api('/admin/banks')
      .then(setBanks)
      .catch((err) => {
        setBanks([])
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  async function create(event) {
    event.preventDefault()
    setError('')
    try {
      const item = await api('/admin/banks', { method: 'POST', body: form })
      setBanks((list) => [item, ...list])
      setForm({ ...EMPTY, units: { ...EMPTY_UNITS } })
      setOpen(false)
    } catch (err) {
      setError(err.message)
    }
  }

  async function saveUnits(bank) {
    setError('')
    try {
      const next = await api(`/admin/banks/${bank.id}`, { method: 'PATCH', body: { units: bank.units } })
      setBanks((list) => list.map((item) => (item.id === bank.id ? next : item)))
    } catch (err) {
      setError(err.message)
    }
  }

  async function toggle(id, hidden) {
    setError('')
    try {
      const next = await api(`/admin/banks/${id}`, { method: 'PATCH', body: { hidden } })
      setBanks((list) => list.map((item) => (item.id === id ? next : item)))
    } catch (err) {
      setError(err.message)
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this blood bank?')) return
    setError('')
    try {
      await api(`/admin/banks/${id}`, { method: 'DELETE' })
      setBanks((list) => list.filter((item) => item.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <DashPageHead
        title="Blood banks"
        subtitle="Inventory shown on Home. Update unit counts here."
        action={(
          <button type="button" className={`${btnOutline} h-10 px-4`} onClick={() => setOpen((value) => !value)}>
            {open ? 'Cancel' : 'Add bank'}
          </button>
        )}
      />
      {error ? <p className="mb-4 text-sm font-medium text-brand">{error}</p> : null}
      {loading ? <p className="mb-4 text-sm text-slate-500">Loading…</p> : null}
      {open ? (
        <form className={`${cardClass} mb-5 grid gap-3 p-5 sm:grid-cols-2`} onSubmit={create}>
          <input className={dashInput} placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <input className={dashInput} placeholder="Distance" value={form.distance} onChange={(event) => setForm({ ...form, distance: event.target.value })} />
          <input className={dashInput} placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          <input className={dashInput} placeholder="Map URL" value={form.map} onChange={(event) => setForm({ ...form, map: event.target.value })} />
          <button type="submit" className={`${btnPrimary} sm:w-auto sm:px-8`}>Save bank</button>
        </form>
      ) : null}
      <div className="space-y-4">
        {banks.map((bank) => (
          <article key={bank.id} className={`${cardClass} p-4`}>
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="m-0 font-extrabold">
                  {bank.name}
                  {bank.hidden ? <span className="ml-2 text-xs font-bold text-brand uppercase">Hidden</span> : null}
                </p>
                <p className="mt-1 mb-0 text-sm text-slate-500">{bank.distance} · {bank.phone}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className={`${btnOutline} h-9`} onClick={() => saveUnits(bank)}>Save units</button>
                <button type="button" className={`${btnOutline} h-9`} onClick={() => toggle(bank.id, !bank.hidden)}>
                  {bank.hidden ? 'Show' : 'Hide'}
                </button>
                <button type="button" className="h-9 px-3 text-sm font-bold text-brand" onClick={() => remove(bank.id)}>Delete</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
              {BLOOD_TYPES.map((type) => (
                <label key={type} className="rounded-xl border border-slate-200 px-2 py-2 text-center text-xs font-bold dark:border-slate-700">
                  {type}
                  <input
                    type="number"
                    min="0"
                    className={`${dashInput} mt-1 h-9 text-center`}
                    value={bank.units?.[type] ?? 0}
                    onChange={(event) => {
                      const value = Number(event.target.value) || 0
                      setBanks((list) => list.map((item) => (
                        item.id === bank.id ? { ...item, units: { ...item.units, [type]: value } } : item
                      )))
                    }}
                  />
                </label>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
