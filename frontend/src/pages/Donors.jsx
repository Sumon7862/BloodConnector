import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import DonorCard from '../components/DonorCard.jsx'
import { BLOOD_TYPES } from '../data/homeData.js'
import { DONOR_AREAS, DONORS } from '../data/donors.js'
import { inputClass } from '../lib/classes.js'

export default function Donors() {
  const [params, setParams] = useSearchParams()
  const [area, setArea] = useState(() => params.get('area') || params.get('city') || '')
  const [bloodType, setBloodType] = useState(() => params.get('bloodType') || '')
  const [query, setQuery] = useState(() => ({
    area: params.get('area') || params.get('city') || '',
    bloodType: params.get('bloodType') || '',
  }))

  useEffect(() => {
    document.title = 'BloodConnector — Donors'
  }, [])

  useEffect(() => {
    const nextArea = params.get('area') || params.get('city') || ''
    const nextType = params.get('bloodType') || ''
    setArea(nextArea)
    setBloodType(nextType)
    setQuery({ area: nextArea, bloodType: nextType })
  }, [params])

  function handleSearch(event) {
    event.preventDefault()
    const next = { area: area.trim(), bloodType }
    setQuery(next)
    const nextParams = new URLSearchParams()
    if (next.area) nextParams.set('area', next.area)
    if (next.bloodType) nextParams.set('bloodType', next.bloodType)
    setParams(nextParams, { replace: true })
  }

  const donors = useMemo(() => {
    const areaValue = query.area.toLowerCase()
    return DONORS.filter((donor) => {
      const areaOk =
        !areaValue ||
        donor.area.toLowerCase().includes(areaValue) ||
        donor.location.toLowerCase().includes(areaValue)
      const typeOk = !query.bloodType || donor.bloodType === query.bloodType
      return areaOk && typeOk
    })
  }, [query])

  const headingType = query.bloodType
  const heading = headingType
    ? `See All Active ${headingType} Donor Near You`
    : 'See All Active Donors Near You'

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
          <h1 className="m-0 text-[clamp(28px,5vw,44px)] leading-tight font-extrabold tracking-tight text-white">
            {heading}
          </h1>

          <form
            className="mx-auto mt-8 grid w-full max-w-[760px] gap-2 rounded-xl bg-white p-2 shadow-lg sm:grid-cols-[1.2fr_0.8fr_auto] dark:bg-panel"
            onSubmit={handleSearch}
          >
            <label className="sr-only" htmlFor="donor-area">Area</label>
            <input
              id="donor-area"
              list="donor-areas"
              type="text"
              placeholder="Enter your city or zip code"
              value={area}
              className={`${inputClass} border-slate-200`}
              onChange={(event) => setArea(event.target.value)}
            />
            <datalist id="donor-areas">
              {DONOR_AREAS.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
            <label className="sr-only" htmlFor="donor-blood-type">Blood group</label>
            <select
              id="donor-blood-type"
              value={bloodType}
              className={`${inputClass} border-slate-200`}
              onChange={(event) => setBloodType(event.target.value)}
            >
              <option value="">Blood Group</option>
              {BLOOD_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand px-5 font-extrabold text-white hover:bg-brand-hover"
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
        {donors.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {donors.map((donor) => (
              <DonorCard key={donor.id} donor={donor} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center text-slate-500 dark:border-slate-700 dark:bg-panel">
            No active donors matched that area and blood group yet.
          </p>
        )}
      </section>
    </Layout>
  )
}
