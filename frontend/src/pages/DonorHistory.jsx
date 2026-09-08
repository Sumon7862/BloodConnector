import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import DonorAvatar from '../components/DonorAvatar.jsx'
import { donationTypeClass, DONATION_TYPES, getDonor, getDonorStats } from '../data/donors.js'
import { btnOutline, cardClass, inputClass } from '../lib/classes.js'

export default function DonorHistory() {
  const { id } = useParams()
  const donor = getDonor(id)
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [yearFilter, setYearFilter] = useState('All Years')
  const [appointments, setAppointments] = useState(donor?.appointments || [])
  const [reminderSet, setReminderSet] = useState(false)

  useEffect(() => {
    if (!donor) return
    document.title = `BloodConnector — ${donor.name}`
    setAppointments(donor.appointments || [])
    setReminderSet(false)
    setTypeFilter('All Types')
    setYearFilter('All Years')
  }, [donor])

  const stats = useMemo(() => (donor ? getDonorStats(donor) : null), [donor])
  const years = useMemo(() => {
    if (!donor) return []
    return [...new Set(donor.donations.map((item) => item.date.slice(-4)))].sort((a, b) => b.localeCompare(a))
  }, [donor])

  const donations = useMemo(() => {
    if (!donor) return []
    return donor.donations.filter((item) => {
      const typeOk = typeFilter === 'All Types' || item.type === typeFilter
      const yearOk = yearFilter === 'All Years' || item.date.endsWith(yearFilter)
      return typeOk && yearOk
    })
  }, [donor, typeFilter, yearFilter])

  if (!donor) return <Navigate to="/donors" replace />

  function exportHistory() {
    const header = ['ID', 'Type', 'Status', 'Date', 'Location', 'Amount (ml)', 'Recipient', 'Blood Bank']
    const rows = donations.map((item) => [
      item.id,
      item.type,
      item.status,
      item.date,
      item.location,
      item.amountMl,
      item.recipient,
      item.bloodBank,
    ])
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${donor.id}-donation-history.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Layout>
      <section className="relative overflow-hidden bg-brand text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.18),transparent_46%)]" aria-hidden="true" />
        <div className="relative mx-auto flex w-[min(1180px,calc(100%-24px))] flex-col items-center py-12 text-center sm:w-[min(1180px,calc(100%-32px))] sm:py-16">
          <DonorAvatar
            name={donor.name}
            photo={donor.photo}
            size="lg"
            className="border-4 border-white shadow-lg"
          />
          <h1 className="mt-5 m-0 text-[clamp(28px,5vw,40px)] font-extrabold tracking-tight text-white">
            {donor.name}
          </h1>
          <p className="mt-2 text-sm text-white/90 sm:text-base">
            {donor.location} | {donor.bloodType}
          </p>
          <a
            href={`tel:${donor.phone}`}
            className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/70 bg-white/10 px-5 font-bold text-white no-underline hover:bg-white hover:text-brand"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M6.5 4h3l1.2 3.2-1.8 1.8a12 12 0 0 0 6.1 6.1l1.8-1.8 3.2 1.2v3A2.5 2.5 0 0 1 17.5 20 15.5 15.5 0 0 1 4 6.5 2.5 2.5 0 0 1 6.5 4Z" />
            </svg>
            Contact
          </a>
        </div>
      </section>

      <div className="bg-zinc-50 dark:bg-ink">
        <div className="mx-auto w-[min(1180px,calc(100%-24px))] py-8 sm:w-[min(1180px,calc(100%-32px))] sm:py-10">
          <header className="mb-6">
            <h2 className="m-0 text-[clamp(26px,4vw,32px)] font-extrabold tracking-tight">Donation History</h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Track your donation journey and upcoming appointments</p>
          </header>

          <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Donations"
              value={String(stats.total)}
              valueClass="text-brand"
              icon={<HeartIcon className="text-brand" />}
            />
            <StatCard
              label="Blood Donated"
              value={`${stats.bloodDonated}ml`}
              valueClass="text-emerald-600 dark:text-emerald-400"
              icon={<TrendIcon className="text-emerald-600 dark:text-emerald-400" />}
            />
            <StatCard
              label="This Year"
              value={String(stats.thisYear)}
              valueClass="text-amber-500"
              icon={<CalendarIcon className="text-amber-500" />}
            />
            <StatCard
              label="Lives Impacted"
              value={`~${stats.livesImpacted}`}
              valueClass="text-orange-500"
              icon={<PeopleIcon className="text-orange-500" />}
            />
          </div>

          <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-5">
              <div className={`${cardClass} flex flex-col gap-3 p-4 sm:flex-row sm:items-center`}>
                <p className="m-0 flex items-center gap-2 text-sm font-bold">
                  <FilterIcon />
                  Filter Donations
                </p>
                <div className="grid flex-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <select className={inputClass} value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
                    <option>All Types</option>
                    {DONATION_TYPES.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                  <select className={inputClass} value={yearFilter} onChange={(event) => setYearFilter(event.target.value)}>
                    <option>All Years</option>
                    {years.map((year) => (
                      <option key={year}>{year}</option>
                    ))}
                  </select>
                  <button type="button" className={`${btnOutline} h-11 px-4`} onClick={exportHistory}>
                    <DownloadIcon />
                    Export History
                  </button>
                </div>
              </div>

              <section>
                <div className="mb-3 flex items-end justify-between gap-3">
                  <h3 className="m-0 text-lg font-extrabold">Donation History</h3>
                  <p className="m-0 text-sm text-slate-500">{donations.length} donations found</p>
                </div>
                <div className="space-y-4">
                  {donations.length ? donations.map((item) => (
                    <article key={item.id} className={`${cardClass} p-4 sm:p-5`}>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${donationTypeClass(item.type)}`}>
                          {item.type}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
                          <CheckIcon />
                          {item.status}
                        </span>
                        <span className="ml-auto text-xs font-semibold text-slate-400">{item.id}</span>
                      </div>
                      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                        <HistoryMeta icon={<CalendarIcon className="text-slate-400" />} label="Date" value={item.date} />
                        <HistoryMeta icon={<PinIcon />} label="Location" value={item.location} />
                        <HistoryMeta icon={<DropIcon />} label="Amount" value={`${item.amountMl}ml donated`} />
                        <HistoryMeta icon={<ClockIcon />} label="Next eligible" value={item.nextEligible} />
                      </dl>
                      <div className="mt-4 flex flex-col gap-1 border-t border-slate-200 pt-3 text-sm text-slate-500 sm:flex-row sm:gap-6 dark:border-slate-700">
                        <p className="m-0"><span className="font-semibold text-slate-700 dark:text-slate-200">Recipient:</span> {item.recipient}</p>
                        <p className="m-0"><span className="font-semibold text-slate-700 dark:text-slate-200">Blood Bank:</span> {item.bloodBank}</p>
                      </div>
                    </article>
                  )) : (
                    <p className={`${cardClass} px-5 py-8 text-center text-slate-500`}>No donations matched those filters.</p>
                  )}
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <section className={`${cardClass} p-4 sm:p-5`}>
                <h3 className="m-0 text-lg font-extrabold">Upcoming Appointments</h3>
                <div className="mt-4 space-y-3">
                  {appointments.length ? appointments.map((item) => (
                    <article key={item.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className={`rounded-md px-2 py-1 text-xs font-bold ${donationTypeClass(item.type)}`}>
                          {item.type}
                        </span>
                        <span className={`rounded-md border px-2 py-1 text-xs font-bold capitalize ${
                          item.status === 'confirmed'
                            ? 'border-brand text-brand'
                            : 'border-amber-400 text-amber-600 dark:text-amber-300'
                        }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="m-0 flex items-center gap-2 text-sm font-semibold">
                        <CalendarIcon className="text-slate-400" /> {item.date}
                      </p>
                      <p className="mt-1.5 flex items-center gap-2 text-sm text-slate-500">
                        <ClockIcon /> {item.time}
                      </p>
                      <p className="mt-1.5 flex items-center gap-2 text-sm text-slate-500">
                        <PinIcon /> {item.location}
                      </p>
                      <button
                        type="button"
                        className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600 hover:bg-slate-200 dark:bg-panel-2 dark:text-slate-300"
                        onClick={() => setAppointments((current) => current.filter((entry) => entry.id !== item.id))}
                      >
                        Cancel
                      </button>
                    </article>
                  )) : (
                    <p className="m-0 text-sm text-slate-500">No upcoming appointments.</p>
                  )}
                </div>
              </section>

              <section className={`${cardClass} p-4 sm:p-5`}>
                <h3 className="m-0 flex items-center gap-2 text-lg font-extrabold text-brand">
                  <ClockIcon className="text-brand" />
                  Next Donation
                </h3>
                <p className="mt-4 mb-0 text-2xl font-extrabold">{donor.nextDonation.dateLabel}</p>
                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-800 dark:bg-amber-400/15 dark:text-amber-200">
                  {donor.nextDonation.daysRemaining} days remaining — {donor.nextDonation.note}
                </p>
                <button
                  type="button"
                  className={`${btnOutline} mt-4 h-11 w-full`}
                  onClick={() => setReminderSet(true)}
                >
                  {reminderSet ? 'Reminder Set' : 'Set Reminder'}
                </button>
              </section>

              <section className="rounded-[14px] border border-emerald-200 bg-emerald-50 p-4 sm:p-5 dark:border-emerald-900/60 dark:bg-emerald-400/10">
                <h3 className="m-0 text-lg font-extrabold text-emerald-800 dark:text-emerald-300">Your Impact</h3>
                <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-bold text-emerald-700 dark:bg-panel dark:text-emerald-300">
                  <span aria-hidden="true">★</span> Life Saver
                </p>
                <p className="mt-3 mb-0 text-sm leading-relaxed text-emerald-800 dark:text-emerald-200">
                  You have helped save approximately {stats.livesImpacted} lives through your generous donations.
                  Thank you for being a hero!
                </p>
              </section>
            </aside>
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              to="/donors"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 text-sm font-bold text-slate-700 no-underline hover:border-brand hover:text-brand dark:border-slate-600 dark:bg-panel dark:text-slate-200"
            >
              Back to Donors
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function StatCard({ icon, value, label, valueClass }) {
  return (
    <div className={`${cardClass} flex items-center gap-3 p-4`}>
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-zinc-50 dark:bg-panel-2">{icon}</span>
      <div>
        <p className={`m-0 text-2xl font-extrabold ${valueClass}`}>{value}</p>
        <p className="mt-0.5 mb-0 text-sm text-slate-500">{label}</p>
      </div>
    </div>
  )
}

function HistoryMeta({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="mt-0.5">{icon}</span>
      <div>
        <dt className="sr-only">{label}</dt>
        <dd className="m-0 font-semibold">{value}</dd>
      </div>
    </div>
  )
}

function HeartIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 fill-current ${className}`} aria-hidden="true">
      <path d="M12 21s-6.5-4.35-9.33-8.18C.5 9.9 1.2 5.8 4.6 4.4 6.7 3.5 9 4.3 12 7c3-2.7 5.3-3.5 7.4-2.6 3.4 1.4 4.1 5.5 1.93 8.42C18.5 16.65 12 21 12 21Z" />
    </svg>
  )
}

function TrendIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 fill-none stroke-current stroke-2 ${className}`} aria-hidden="true">
      <path d="M4 16l5-5 4 3 7-8" />
      <path d="M14 6h6v6" />
    </svg>
  )
}

function CalendarIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 fill-none stroke-current stroke-2 ${className}`} aria-hidden="true">
      <rect x="4" y="6" width="16" height="14" rx="2" />
      <path d="M8 4v4M16 4v4M4 10h16" />
    </svg>
  )
}

function PeopleIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 fill-none stroke-current stroke-2 ${className}`} aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M4 19c.8-3 2.8-5 5-5s4.2 2 5 5" />
      <circle cx="16.5" cy="9" r="2.2" />
      <path d="M20 19c-.5-2.2-1.8-3.7-3.5-4.2" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2" aria-hidden="true">
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2" aria-hidden="true">
      <path d="M12 5v10M8 11l4 4 4-4M6 19h12" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2" aria-hidden="true">
      <path d="M5 12l5 5 9-10" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2 text-slate-400" aria-hidden="true">
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="12" cy="11" r="1.8" />
    </svg>
  )
}

function DropIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-slate-400" aria-hidden="true">
      <path d="M12 3s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11Z" />
    </svg>
  )
}

function ClockIcon({ className = 'text-slate-400' }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 fill-none stroke-current stroke-2 ${className}`} aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5l3 2" />
    </svg>
  )
}
