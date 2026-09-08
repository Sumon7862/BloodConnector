import { useEffect, useMemo, useState } from 'react'
import DashPageHead from '../../components/DashPageHead.jsx'
import IconField, { IconInput, IconSelect } from '../../components/IconField.jsx'
import RequestCard from '../../components/RequestCard.jsx'
import { BLOOD_GROUPS, validatePhone, validateRequired } from '../../utils/validation.js'
import { btnPrimary, cardClass, dashInput } from '../../lib/classes.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { createBloodRequest, sortRequests, useRequests, userIdFrom } from '../../lib/requests.js'

export default function RequestBlood() {
  const { user } = useAuth()
  const requests = useRequests()
  const [form, setForm] = useState({
    bloodType: '',
    urgency: '',
    location: user.address || '',
    contact: user.phone || user.emailOrPhone || '',
    details: '',
  })
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const myId = userIdFrom(user)
  const mine = useMemo(
    () => sortRequests(requests.filter((item) => item.requesterId === myId)),
    [requests, myId],
  )

  useEffect(() => {
    document.title = 'BloodConnector — Request Blood'
  }, [])

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
    setSaved(false)
    setFormError('')
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {
      bloodType: validateRequired(form.bloodType, 'Please select the required blood type.'),
      urgency: validateRequired(form.urgency, 'Please select an urgency level.'),
      location: validateRequired(form.location, 'Location is required.')
        || (form.location.trim().length < 3 ? 'Enter a valid hospital or area name.' : ''),
      contact: validatePhone(form.contact),
      details: validateRequired(form.details, 'Please add additional details.'),
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) {
      setFormError('Please complete all required fields.')
      setSaved(false)
      return
    }
    setSubmitting(true)
    try {
      await createBloodRequest(user, form)
      setSaved(true)
      setFormError('')
      setErrors({})
      setForm({
        bloodType: '',
        urgency: '',
        location: user.address || '',
        contact: user.phone || user.emailOrPhone || '',
        details: '',
      })
    } catch (error) {
      setSaved(false)
      setFormError(error.message || 'Could not submit that request.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <DashPageHead
        title="Request Blood"
        subtitle="Your request appears on Home. Users with the same blood group get it on their dashboard to contact you or cancel."
      />
      <form className={`${cardClass} max-w-3xl p-5 sm:p-7`} onSubmit={handleSubmit} noValidate>
        <h2 className="mb-5 text-lg font-extrabold">Request Blood</h2>
        <div className="grid gap-4">
          <IconField id="req-type" label="Blood Type Required" required error={errors.bloodType}>
            <IconSelect
              id="req-type"
              icon="drop"
              value={form.bloodType}
              className={errors.bloodType ? 'border-brand' : ''}
              onChange={(event) => setField('bloodType', event.target.value)}
            >
              <option value="">Select Blood Type</option>
              {BLOOD_GROUPS.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </IconSelect>
          </IconField>
          <IconField id="req-urgency" label="Urgency Level" required error={errors.urgency}>
            <IconSelect
              id="req-urgency"
              value={form.urgency}
              className={errors.urgency ? 'border-brand' : ''}
              onChange={(event) => setField('urgency', event.target.value)}
            >
              <option value="">Urgency Level</option>
              <option>Critical</option>
              <option>High</option>
              <option>Regular</option>
            </IconSelect>
          </IconField>
          <IconField id="req-location" label="Location" required error={errors.location}>
            <IconInput
              id="req-location"
              icon="pin"
              placeholder="Hospital or Area name"
              value={form.location}
              className={errors.location ? 'border-brand' : ''}
              onChange={(event) => setField('location', event.target.value)}
            />
          </IconField>
          <IconField id="req-contact" label="Contact Number" required error={errors.contact}>
            <IconInput
              id="req-contact"
              icon="phone"
              placeholder="Your contact number"
              value={form.contact}
              className={errors.contact ? 'border-brand' : ''}
              onChange={(event) => setField('contact', event.target.value)}
            />
          </IconField>
          <IconField id="req-details" label="Additional Details" required error={errors.details}>
            <textarea
              id="req-details"
              rows="5"
              placeholder="Patient Condition, Special requirement, etc"
              value={form.details}
              className={`${dashInput} h-auto min-h-28 py-3 ${errors.details ? 'border-brand' : ''}`}
              onChange={(event) => setField('details', event.target.value)}
            />
          </IconField>
        </div>
        {formError ? <p className="mt-4 mb-0 text-sm font-medium text-brand" role="alert">{formError}</p> : null}
        {saved ? <p className="mt-4 mb-0 text-sm font-medium text-emerald-600">Your request is live. Matching blood-group donors will see it on their dashboard.</p> : null}
        <button type="submit" className={`${btnPrimary} mt-5`} disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit Blood Request'}
        </button>
      </form>

      <section className="mt-8 max-w-3xl">
        <h2 className="mb-4 text-lg font-extrabold">Your requests</h2>
        {mine.length ? (
          <div className="grid gap-4">
            {mine.map((request) => (
              <RequestCard key={request.id} request={request} showResponses />
            ))}
          </div>
        ) : (
          <p className="m-0 text-sm text-slate-500">You have not submitted a blood request yet.</p>
        )}
      </section>
    </div>
  )
}
