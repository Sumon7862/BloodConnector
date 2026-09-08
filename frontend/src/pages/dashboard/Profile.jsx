import { useEffect, useMemo, useState } from 'react'
import DashPageHead from '../../components/DashPageHead.jsx'
import { Icon } from '../../components/DashIcons.jsx'
import { IconInput, IconSelect } from '../../components/IconField.jsx'
import { btnOutline, cardClass, dashInput } from '../../lib/classes.js'
import { readImageFile, roleLabel } from '../../lib/user.js'
import DonationCountdown from '../../components/DonationCountdown.jsx'
import { DONATION_WAIT_DAYS, isDonationEligible, markDonatedNow } from '../../lib/eligibility.js'
import {
  BLOOD_GROUPS,
  validateAddress,
  validateBloodGroup,
  validateEmail,
  validateFullName,
  validatePhone,
} from '../../utils/validation.js'
import { SEED_APPOINTMENTS } from '../../data/dashboardData.js'
import { useAuth } from '../../context/AuthContext.jsx'

function storageKey(prefix, user) {
  return `${prefix}-${String(user.emailOrPhone || user.name || 'member').toLowerCase()}`
}

function loadList(key, seed) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : seed
  } catch {
    return seed
  }
}

function joinLabel(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } catch {
    return '2024'
  }
}

function contactParts(user) {
  const raw = String(user.emailOrPhone || '')
  const isEmail = raw.includes('@')
  return {
    email: user.email || (isEmail ? raw : ''),
    phone: user.phone || (!isEmail ? raw : ''),
  }
}

function formFromUser(user) {
  const contacts = contactParts(user)
  return {
    name: user.name || '',
    email: contacts.email,
    phone: contacts.phone,
    bloodGroup: user.bloodGroup || '',
    address: user.address || '',
    age: user.age || '',
    weight: user.weight || '',
    emergencyContact: user.emergencyContact || '',
    medicalConditions: user.medicalConditions || '',
    specialization: user.specialization || 'General Physician',
    registration: user.registration || '',
    hospital: user.hospital || '',
    experience: user.experience || '5',
    bio: user.bio || '',
  }
}

export default function DashboardProfile() {
  const { user, updateUser } = useAuth()
  const isDoctor = user.role === 'doctor'
  const appointmentKey = storageKey('bloodconnector-appointments', user)
  const extraPhones = user.phones || []

  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState({})
  const [newPhone, setNewPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [appointments, setAppointments] = useState(() => loadList(appointmentKey, SEED_APPOINTMENTS))
  const [form, setForm] = useState(() => formFromUser(user))

  useEffect(() => {
    if (!editing) setForm(formFromUser(user))
  }, [user, editing])

  useEffect(() => {
    document.title = isDoctor ? 'BloodConnector — Doctor Profile' : 'BloodConnector — My Profile'
  }, [isDoctor])

  const donations = Number(user.donationCount) || 12
  const consultations = Number(user.consultations) || 48
  const lives = donations * 3
  const patients = Math.max(consultations - 12, 36)
  const bloodLiters = `${(donations * 0.5).toFixed(donations % 2 ? 1 : 0)} L`

  const badges = isDoctor
    ? [
        ['bg-rose-100 text-brand', `Specialist ${form.specialization || 'General Physician'}`],
        ['bg-emerald-100 text-emerald-700', `Exp: ${form.experience || 5} Years`],
        ['bg-rose-50 text-brand', `${consultations} Consultations`],
      ]
    : [
        ['bg-rose-100 text-brand', `Blood type ${form.bloodGroup || 'O+'}`],
        ['bg-emerald-100 text-emerald-700', `${donations} donation`],
        ['bg-rose-50 text-brand', `${lives} Life saved`],
      ]

  const stats = isDoctor
    ? [
        ['consult', String(consultations), 'Total Consultations'],
        ['pulse', String(patients), 'Patients Assisted'],
        ['star', String(user.rating || '4.8'), 'Average Rating'],
      ]
    : [
        ['calendar', String(donations), 'Total Donations'],
        ['drop', bloodLiters, 'Blood Donated'],
        ['user', String(lives), 'Life Saved'],
      ]

  const fieldClass = editing ? '' : 'pointer-events-none'

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
    setSaved(false)
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  function handleSave(event) {
    event.preventDefault()
    const nextErrors = {
      name: validateFullName(form.name),
      address: validateAddress(form.address),
      email: form.email.trim() ? validateEmail(form.email) : '',
      phone: validatePhone(form.phone, { required: !form.email.trim() && extraPhones.length === 0 }),
      bloodGroup: isDoctor ? '' : validateBloodGroup(form.bloodGroup),
    }
    const hasError = Object.values(nextErrors).some(Boolean)
    setErrors(nextErrors)
    if (hasError) return

    updateUser({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      emailOrPhone: form.email.trim() || form.phone.trim() || user.emailOrPhone,
      bloodGroup: form.bloodGroup,
      address: form.address.trim(),
      age: form.age,
      weight: form.weight,
      emergencyContact: form.emergencyContact,
      medicalConditions: form.medicalConditions,
      specialization: form.specialization,
      registration: form.registration,
      hospital: form.hospital,
      experience: form.experience,
      bio: form.bio,
    })
    setEditing(false)
    setSaved(true)
  }

  function cancelEdit() {
    setForm(formFromUser(user))
    setErrors({})
    setEditing(false)
  }

  function addNumber(event) {
    event.preventDefault()
    const error = validatePhone(newPhone)
    if (error) {
      setPhoneError(error)
      return
    }
    const value = newPhone.trim()
    const existing = [user.phone, ...extraPhones].map((item) => String(item).replace(/\D/g, ''))
    if (existing.includes(value.replace(/\D/g, ''))) {
      setPhoneError('That number is already on your profile.')
      return
    }
    if (user.phone) {
      updateUser({ phones: [...extraPhones, value] })
    } else {
      updateUser({ phone: value, emailOrPhone: user.email || value || user.emailOrPhone })
      setForm((current) => ({ ...current, phone: value }))
    }
    setNewPhone('')
    setPhoneError('')
  }

  function removeNumber(value, isPrimary) {
    if (isPrimary) {
      const [nextPrimary, ...rest] = extraPhones
      updateUser({
        phone: nextPrimary || '',
        phones: rest,
        emailOrPhone: user.email || nextPrimary || user.emailOrPhone,
      })
      setForm((current) => ({ ...current, phone: nextPrimary || '' }))
      return
    }
    updateUser({ phones: extraPhones.filter((item) => item !== value) })
  }

  async function handlePhoto(event) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      updateUser({ photo: await readImageFile(file) })
    } catch {
      /* keep current photo */
    }
  }

  const joined = useMemo(() => joinLabel(user.joinedAt), [user.joinedAt])

  return (
    <div>
      <DashPageHead
        title={isDoctor ? 'Doctor Profile' : 'My Profile'}
        subtitle={
          isDoctor
            ? 'Manage your medical profile and consultation details'
            : 'Manage your personal information and preferences'
        }
      />

      <section className={`${cardClass} p-5 sm:p-6`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <label className="relative mx-auto shrink-0 cursor-pointer sm:mx-0">
            {user.photo ? (
              <img src={user.photo} alt="" className="h-24 w-24 rounded-full object-cover" />
            ) : (
              <span className="grid h-24 w-24 place-items-center rounded-full bg-brand text-white">
                <Icon name="user" className="h-11 w-11" />
              </span>
            )}
            <input type="file" accept="image/*" className="sr-only" onChange={handlePhoto} />
          </label>
          <div className="min-w-0 text-center sm:text-left">
            <h2 className="m-0 text-2xl font-extrabold sm:text-3xl">{form.name || user.name}</h2>
            <p className="mt-1 mb-3 text-sm text-slate-500">
              {isDoctor ? 'Doctor' : 'Blood Donor'} • Member since {joined}
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              {badges.map(([tone, label]) => (
                <span key={label} className={`rounded-lg px-3 py-1.5 text-sm font-bold ${tone}`}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)]">
        <div className="space-y-5">
        <form className={`${cardClass} p-5 sm:p-6`} onSubmit={handleSave}>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="m-0 flex items-center gap-2 text-lg font-extrabold">
                <Icon name="user" className="h-5 w-5 text-brand" /> Personal Information
              </h2>
              <p className="mt-1 mb-0 text-sm text-slate-500">
                {isDoctor
                  ? 'Your professional profile and clinic details.'
                  : 'Your donor profile and medical information.'}
              </p>
            </div>
            {editing ? (
              <div className="flex flex-wrap gap-2">
                <button type="submit" className="inline-flex h-10 items-center justify-center rounded-lg bg-brand px-4 text-sm font-bold text-white hover:bg-brand-hover">
                  Save Profile
                </button>
                <button type="button" className={btnOutline} onClick={cancelEdit}>
                  Cancel
                </button>
              </div>
            ) : (
              <button type="button" className={btnOutline} onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>

          <div className={`grid gap-4 sm:grid-cols-2 ${fieldClass}`}>
            <Field label="Full Name" error={errors.name}>
              <IconInput icon="user" value={form.name} readOnly={!editing} onChange={(event) => setField('name', event.target.value)} />
            </Field>
            {isDoctor ? (
              <Field label="Specialization">
                <IconInput icon="consult" value={form.specialization} readOnly={!editing} onChange={(event) => setField('specialization', event.target.value)} />
              </Field>
            ) : (
              <Field label="Blood Type" error={errors.bloodGroup}>
                <IconSelect icon="drop" value={form.bloodGroup} disabled={!editing} onChange={(event) => setField('bloodGroup', event.target.value)}>
                  <option value="">Select Blood Type</option>
                  {BLOOD_GROUPS.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </IconSelect>
              </Field>
            )}
            <Field label="Email" error={errors.email}>
              <IconInput icon="mail" type="email" value={form.email} readOnly={!editing} onChange={(event) => setField('email', event.target.value)} />
            </Field>
            <Field label="Phone Number" error={errors.phone}>
              <IconInput icon="phone" value={form.phone} readOnly={!editing} onChange={(event) => setField('phone', event.target.value)} />
            </Field>
            <Field label="Age">
              <IconInput icon="calendar" value={form.age} readOnly={!editing} onChange={(event) => setField('age', event.target.value)} />
            </Field>
            {isDoctor ? (
              <>
                <Field label="Medical Registration Number">
                  <IconInput icon="shield" placeholder="BMDC-000000" value={form.registration} readOnly={!editing} onChange={(event) => setField('registration', event.target.value)} />
                </Field>
                <Field label="Years of Experience">
                  <IconInput icon="clock" value={form.experience} readOnly={!editing} onChange={(event) => setField('experience', event.target.value)} />
                </Field>
                <Field label="Working Hospital/Clinic" className="sm:col-span-2">
                  <IconInput icon="building" value={form.hospital} readOnly={!editing} onChange={(event) => setField('hospital', event.target.value)} />
                </Field>
              </>
            ) : (
              <>
                <Field label="Weight (kg)">
                  <IconInput icon="pulse" value={form.weight} readOnly={!editing} onChange={(event) => setField('weight', event.target.value)} />
                </Field>
                <Field label="Emergency Contact">
                  <IconInput icon="phone" value={form.emergencyContact} readOnly={!editing} onChange={(event) => setField('emergencyContact', event.target.value)} />
                </Field>
              </>
            )}
            <Field label="Location" className="sm:col-span-2" error={errors.address}>
              <IconInput icon="pin" value={form.address} readOnly={!editing} onChange={(event) => setField('address', event.target.value)} />
            </Field>
            <Field label={isDoctor ? 'Professional Bio' : 'Medical Conditions'} className="sm:col-span-2">
              <textarea
                rows="4"
                readOnly={!editing}
                value={isDoctor ? form.bio : form.medicalConditions}
                className={`${dashInput} h-auto min-h-24 py-3`}
                placeholder={isDoctor ? 'Qualifications, chamber hours, and care focus' : 'None'}
                onChange={(event) => setField(isDoctor ? 'bio' : 'medicalConditions', event.target.value)}
              />
            </Field>
          </div>
          {saved ? <p className="mt-4 mb-0 text-sm font-medium text-emerald-600">Profile updated.</p> : null}
        </form>

        <section className={`${cardClass} p-5 sm:p-6`}>
          <h2 className="m-0 flex items-center gap-2 text-lg font-extrabold">
            <Icon name="phone" className="h-5 w-5 text-brand" /> Phone numbers
          </h2>
          <p className="mt-1 mb-4 text-sm text-slate-500">Keep extra numbers on your profile so people can reach you.</p>
          <div className="space-y-2">
            {user.phone ? (
              <div className="flex items-center justify-between gap-3 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-panel-2">
                <span className="text-sm font-semibold">{user.phone}</span>
                <span className="flex items-center gap-2">
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-brand">Primary</span>
                  {extraPhones.length > 0 ? (
                    <button type="button" className="text-slate-400 hover:text-brand" aria-label={`Remove ${user.phone}`} onClick={() => removeNumber(user.phone, true)}>
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  ) : null}
                </span>
              </div>
            ) : null}
            {extraPhones.map((number) => (
              <div key={number} className="flex items-center justify-between gap-3 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-panel-2">
                <span className="text-sm font-semibold">{number}</span>
                <button type="button" className="text-slate-400 hover:text-brand" aria-label={`Remove ${number}`} onClick={() => removeNumber(number, false)}>
                  <Icon name="trash" className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={addNumber}>
            <div className="min-w-0 flex-1">
              <IconInput icon="phone" placeholder="Add another number" value={newPhone} onChange={(event) => { setNewPhone(event.target.value); setPhoneError('') }} />
            </div>
            <button type="submit" className="inline-flex h-11 items-center justify-center rounded-lg bg-brand px-4 text-sm font-bold text-white hover:bg-brand-hover">
              Add number
            </button>
          </form>
          {phoneError ? <p className="mt-2 mb-0 text-xs text-brand">{phoneError}</p> : null}
        </section>
        </div>

        <div className="space-y-5">
          <section className={`${cardClass} p-5`}>
            <h2 className="m-0 flex items-center gap-2 text-base font-extrabold">
              <Icon name="heart" className="h-5 w-5 text-brand" />
              {isDoctor ? 'Consultation Status' : 'Donation Status'}
            </h2>
            <div className="mt-5 flex flex-col items-center text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-brand text-lg font-extrabold text-white">
                {isDoctor ? 'MD' : form.bloodGroup || 'O+'}
              </span>
              <p className={`mt-4 mb-0 flex items-center gap-2 font-bold ${
                isDoctor
                  ? user.available !== false ? 'text-emerald-600' : 'text-slate-500'
                  : isDonationEligible(user.nextEligibleAt) && user.available !== false
                    ? 'text-emerald-600'
                    : 'text-slate-500'
              }`}
              >
                <Icon name={isDoctor || (isDonationEligible(user.nextEligibleAt) && user.available !== false) ? 'check' : 'clock'} className="h-4 w-4" />
                {isDoctor
                  ? user.available !== false
                    ? 'Available for consults'
                    : 'Currently unavailable'
                  : isDonationEligible(user.nextEligibleAt) && user.available !== false
                    ? 'Available to Donate'
                    : 'Waiting for next donation'}
              </p>
              {isDoctor ? (
                <>
                  <p className="mt-1 mb-0 text-sm text-slate-500">Ready to take patients</p>
                  <button
                    type="button"
                    className={`${btnOutline} mt-3 h-9`}
                    onClick={() => updateUser({ available: user.available === false })}
                  >
                    {user.available !== false ? 'Set unavailable' : 'Set available'}
                  </button>
                </>
              ) : (
                <div className="mt-4 w-full">
                  <DonationCountdown until={user.nextEligibleAt} />
                  <button
                    type="button"
                    className={`${btnOutline} mt-4 h-9`}
                    onClick={() => updateUser({
                      ...markDonatedNow(),
                      donationCount: donations + 1,
                    })}
                  >
                    I donated today
                  </button>
                  <p className="mt-2 mb-0 text-xs text-slate-400">Wait {DONATION_WAIT_DAYS} days after each whole blood donation.</p>
                </div>
              )}
              <p className="mt-5 mb-0 text-4xl font-extrabold text-brand">
                {isDoctor ? consultations : donations}
              </p>
              <p className="mt-1 mb-0 text-sm text-slate-500">
                {isDoctor ? 'Total Consultations' : 'Total Donations'}
              </p>
            </div>
          </section>

          <section className="rounded-[14px] border border-brand/40 bg-white p-5 dark:border-brand/40 dark:bg-panel">
            <h2 className="m-0 flex items-center gap-2 text-base font-extrabold text-brand">
              <Icon name="alert" className="h-5 w-5" /> Emergency Alerts
            </h2>
            <p className="mt-3 mb-0 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {isDoctor
                ? 'Get notified when patients in your area need urgent medical advice around a blood request.'
                : 'Get notified when your blood type is urgently needed in your area.'}
            </p>
          </section>
        </div>
      </div>

      {isDoctor ? (
        <section className={`${cardClass} mt-5 p-5 sm:p-6`}>
          <h2 className="m-0 flex items-center gap-2 text-lg font-extrabold">
            <Icon name="calendar" className="h-5 w-5 text-brand" /> Upcoming Appointments
          </h2>
          <p className="mt-1 mb-4 text-sm text-slate-500">Patients scheduled for phone, video, or chat consults.</p>
          <div className="space-y-3">
            {appointments.map((item) => {
              const upcoming = item.status === 'Upcoming'
              return (
              <article key={item.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center dark:border-slate-700">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="m-0 text-base font-extrabold">{item.name}</h3>
                    <span className="rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-white">{item.mode}</span>
                  </div>
                  <p className="mt-1 mb-0 text-sm text-slate-500">{item.detail}</p>
                  <p className="mt-1 mb-0 flex items-center gap-1.5 text-sm text-slate-500">
                    <Icon name="clock" className="h-4 w-4" /> {item.date}
                  </p>
                </div>
                <span className={`self-start rounded-full px-2.5 py-1 text-xs font-bold ${
                  upcoming ? 'bg-brand text-white' : 'bg-emerald-100 text-emerald-700'
                }`}
                >
                  {item.status}
                </span>
                <button
                  type="button"
                  className="self-start text-slate-400 hover:text-brand"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => {
                    const next = appointments.filter((row) => row.id !== item.id)
                    setAppointments(next)
                    localStorage.setItem(appointmentKey, JSON.stringify(next))
                  }}
                >
                  <Icon name="trash" />
                </button>
              </article>
              )
            })}
          </div>
        </section>
      ) : null}

      <h2 className="mt-8 mb-4 text-lg font-extrabold">
        {isDoctor ? 'Consultation Statistics' : 'Donation Statistics'}
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(([icon, value, label]) => (
          <article key={label} className="rounded-[14px] border border-slate-200 bg-zinc-50 px-5 py-6 text-center dark:border-slate-700 dark:bg-panel-2">
            <span className="mx-auto grid h-11 w-11 place-items-center text-brand">
              <Icon name={icon} className="h-7 w-7" />
            </span>
            <p className="mt-3 mb-1 text-3xl font-extrabold">{value}</p>
            <p className="m-0 text-sm text-slate-500">{label}</p>
          </article>
        ))}
      </div>
      <p className="mt-4 mb-0 text-xs text-slate-400">Signed in as {roleLabel(user.role)}</p>
    </div>
  )
}

function Field({ label, className = '', error, children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {error ? <p className="mt-1 mb-0 text-xs text-brand">{error}</p> : null}
    </label>
  )
}
