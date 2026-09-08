import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import DonorCard from '../components/DonorCard.jsx'
import BloodTypeBadge from '../components/BloodTypeBadge.jsx'
import { BLOOD_TYPES } from '../data/homeData.js'
import { DONOR_AREAS, DONORS } from '../data/donors.js'
import { inputClass } from '../lib/classes.js'
import { donorFiltersToParams, filterDonors, readDonorFilters } from '../lib/donorsFilter.js'

const AVAILABILITY_OPTIONS = [
  { value: '', label: 'All availability' },
  { value: 'available', label: 'Available' },
  { value: 'unavailable', label: 'Not available' },
]

export default function Donors() {
  const [params, setParams] = useSearchParams()
  const [filters, setFilters] = useState(() => readDonorFilters(params))

  useEffect(() => {
    document.title = 'BloodConnector — Donors'
  }, [])

  useEffect(() => {
    setFilters(readDonorFilters(params))
  }, [params])

  function setFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function applyFilters(event, nextFilters = filters) {
    event?.preventDefault()
    const next = {
      q: String(nextFilters.q || '').trim(),
      area: String(nextFilters.area || '').trim(),
      bloodType: nextFilters.bloodType || '',
      availability: nextFilters.availability || '',
    }
    setFilters(next)
    setParams(donorFiltersToParams(next), { replace: true })
  }

  function handleSelect(name, value) {
    const next = { ...filters, [name]: value }
    setFilters(next)
    applyFilters(undefined, next)
  }

  function clearFilters() {
    const empty = { q: '', area: '', bloodType: '', availability: '' }
    setFilters(empty)
    setParams(new URLSearchParams(), { replace: true })
  }

  const donors = useMemo(
    () => filterDonors(DONORS, filters),
    [filters],
  )

  const hasFilters = Boolean(filters.q || filters.area || filters.bloodType || filters.availability)

  return (
    <Layout>
      <section className="relative overflow-hidden bg-brand text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <svg viewBox="0 0 960 280" className="h-full w-full opacity-[0.22]" preserveAspectRatio="xMidYMid slice">
            <g fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round">
              <path d="M360 210c-70-80-40-150 20-150 42 0 70 38 100 80" />
              <path d="M600 210c70-80 40-150-20-150-42 0-70 38-100 80" />
              <path d="M460 168c-18-44 8-78 48-78s62 40 32 90" />
            </g>
          </svg>
          <div className="absolute inset-0 bg-gradient-to-b from-brand/70 to-brand" />
        </div>

        <div className="relative mx-auto w-[min(1180px,calc(100%-24px))] py-12 text-center sm:w-[min(1180px,calc(100%-32px))] sm:py-16">
          <h1 className="m-0 inline-flex flex-wrap items-center justify-center gap-2 text-[clamp(28px,5vw,44px)] leading-tight font-extrabold tracking-tight text-white">
            {filters.availability === 'unavailable'
              ? 'Unavailable'
              : filters.availability === 'available'
                ? 'Available'
                : null}
            {filters.bloodType ? <BloodTypeBadge type={filters.bloodType} size="lg" tone="inverse" /> : null}
            {filters.availability || filters.bloodType ? 'donors near you' : 'Donors near you'}
          </h1>

          <form
            className="mx-auto mt-8 grid w-full max-w-[1080px] gap-2 rounded-xl bg-white p-2 shadow-lg sm:grid-cols-2 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_0.72fr_0.95fr_auto] dark:bg-panel"
            onSubmit={applyFilters}
          >
            <label className="sr-only" htmlFor="donor-name">Name, phone or email</label>
            <input
              id="donor-name"
              type="text"
              placeholder="Name, phone or email"
              value={filters.q}
              className={`${inputClass} border-slate-200`}
              onChange={(event) => setFilter('q', event.target.value)}
            />
            <label className="sr-only" htmlFor="donor-area">City or area</label>
            <input
              id="donor-area"
              list="donor-areas"
              type="text"
              placeholder="City or area"
              value={filters.area}
              className={`${inputClass} border-slate-200`}
              onChange={(event) => setFilter('area', event.target.value)}
            />
            <datalist id="donor-areas">
              {DONOR_AREAS.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
            <label className="sr-only" htmlFor="donor-blood-type">Blood group</label>
            <select
              id="donor-blood-type"
              value={filters.bloodType}
              className={`${inputClass} border-slate-200`}
              onChange={(event) => handleSelect('bloodType', event.target.value)}
            >
              <option value="">Blood group</option>
              {BLOOD_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor="donor-availability">Availability</label>
            <select
              id="donor-availability"
              value={filters.availability}
              className={`${inputClass} border-slate-200`}
              onChange={(event) => handleSelect('availability', event.target.value)}
            >
              {AVAILABILITY_OPTIONS.map((item) => (
                <option key={item.label} value={item.value}>{item.label}</option>
              ))}
            </select>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand px-5 font-extrabold text-white hover:bg-brand-hover sm:col-span-2 xl:col-span-1"
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current stroke-2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.2-3.2" />
              </svg>
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto w-[min(1180px,calc(100%-24px))] py-8 sm:w-[min(1180px,calc(100%-32px))] sm:py-12">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <p className="m-0 text-sm font-semibold text-slate-500 dark:text-slate-400">
            {donors.length} {donors.length === 1 ? 'donor' : 'donors'} found
          </p>
          {hasFilters ? (
            <button type="button" className="text-sm font-bold text-brand hover:underline" onClick={clearFilters}>
              Clear filters
            </button>
          ) : null}
        </div>
        {donors.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {donors.map((donor) => (
              <DonorCard key={donor.id} donor={donor} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center text-slate-500 dark:border-slate-700 dark:bg-panel">
            No donors matched that name, area, blood group, or availability.
          </p>
        )}
      </section>
    </Layout>
  )
}
