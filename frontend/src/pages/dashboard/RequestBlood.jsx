import { useEffect, useState } from 'react'
import DashPageHead from '../../components/DashPageHead.jsx'
import IconField, { IconInput, IconSelect } from '../../components/IconField.jsx'
import { BLOOD_GROUPS } from '../../utils/validation.js'
import { btnPrimary, cardClass, dashInput } from '../../lib/classes.js'
import { useAuth } from '../../context/AuthContext.jsx'

const REQUESTS_KEY = 'bloodconnector-blood-requests'

export default function RequestBlood() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    bloodType: '',
    urgency: '',
    location: user.address || '',
    contact: user.phone || user.emailOrPhone || '',
    details: '',
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    document.title = 'BloodConnector — Request Blood'
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.bloodType || !form.urgency || !form.location.trim() || !form.contact.trim() || !form.details.trim()) {
      return
    }
    const current = JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]')
    localStorage.setItem(
      REQUESTS_KEY,
      JSON.stringify([{ id: crypto.randomUUID(), ...form, createdAt: new Date().toISOString() }, ...current]),
    )
    setSaved(true)
  }

  return (
    <div>
      <DashPageHead title="Request Blood" subtitle="Submit an emergency or regular blood request" />
      <form className={`${cardClass} max-w-3xl p-5 sm:p-7`} onSubmit={handleSubmit}>
        <h2 className="mb-5 text-lg font-extrabold">Request Blood</h2>
        <div className="grid gap-4">
          <IconField id="req-type" label="Blood Type Required" required>
            <IconSelect
              id="req-type"
              icon="drop"
              value={form.bloodType}
              onChange={(event) => setForm({ ...form, bloodType: event.target.value })}
            >
              <option value="">Select Blood Type</option>
              {BLOOD_GROUPS.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </IconSelect>
          </IconField>
          <IconField id="req-urgency" label="Urgency Level" required>
            <IconSelect
              id="req-urgency"
              value={form.urgency}
              onChange={(event) => setForm({ ...form, urgency: event.target.value })}
            >
              <option value="">Urgency Level</option>
              <option>Critical</option>
              <option>High</option>
              <option>Regular</option>
            </IconSelect>
          </IconField>
          <IconField id="req-location" label="Location" required>
            <IconInput
              id="req-location"
              icon="pin"
              placeholder="Hospital or Area name"
              value={form.location}
              onChange={(event) => setForm({ ...form, location: event.target.value })}
            />
          </IconField>
          <IconField id="req-contact" label="Contact Number" required>
            <IconInput
              id="req-contact"
              icon="phone"
              placeholder="Your contact number"
              value={form.contact}
              onChange={(event) => setForm({ ...form, contact: event.target.value })}
            />
          </IconField>
          <IconField id="req-details" label="Additional Details" required>
            <textarea
              id="req-details"
              rows="5"
              placeholder="Patient Condition, Special requirement, etc"
              value={form.details}
              className={`${dashInput} h-auto min-h-28 py-3`}
              onChange={(event) => setForm({ ...form, details: event.target.value })}
            />
          </IconField>
        </div>
        {saved ? <p className="mt-4 mb-0 text-sm font-medium text-emerald-600">Your blood request has been submitted.</p> : null}
        <button type="submit" className={`${btnPrimary} mt-5`}>
          Submit Blood Request
        </button>
      </form>
    </div>
  )
}
