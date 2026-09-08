import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import DonorCard from '../components/DonorCard.jsx'
import DoctorCard from '../components/DoctorCard.jsx'
import OpinionSlider from '../components/OpinionSlider.jsx'
import RequestCard from '../components/RequestCard.jsx'
import BloodTypeBadge from '../components/BloodTypeBadge.jsx'
import NetworkRoles from '../components/NetworkRoles.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import {
  BLOOD_TYPES,
  HOME_STATS,
  HOW_IT_WORKS,
} from '../data/homeData.js'
import { fetchBanks, fetchDonors } from '../lib/directory.js'
import { fetchDoctors } from '../data/doctors.js'
import { btnOutline, cardClass, inputClass, pageWidth } from '../lib/classes.js'
import { filterDonors } from '../lib/donorsFilter.js'
import { openRequests, useRequests } from '../lib/requests.js'

export default function Home() {
  const { isLoggedIn } = useAuth()
  const requests = useRequests()
  const urgent = openRequests(requests).slice(0, 3)
  const [params] = useSearchParams()
  const [city, setCity] = useState(() => params.get('city') || '')
  const [bloodType, setBloodType] = useState(() => params.get('bloodType') || '')
  const [query, setQuery] = useState(() => ({
    city: params.get('city') || '',
    bloodType: params.get('bloodType') || '',
  }))
  const [showAllBanks, setShowAllBanks] = useState(false)
  const [allDonors, setAllDonors] = useState([])
  const [banks, setBanks] = useState([])
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    document.title = 'BloodConnector'
  }, [])

  useEffect(() => {
    let cancelled = false
    fetchDonors().then((list) => { if (!cancelled) setAllDonors(list) })
    fetchBanks().then((list) => { if (!cancelled) setBanks(list) })
    fetchDoctors().then((list) => { if (!cancelled) setDoctors(list) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const nextCity = params.get('city') || ''
    const nextType = params.get('bloodType') || ''
    setCity(nextCity)
    setBloodType(nextType)
    setQuery({ city: nextCity, bloodType: nextType })
  }, [params])

  function handleSearch(event) {
    event.preventDefault()
    setQuery({ city: city.trim(), bloodType })
    document.getElementById('donors')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const donors = useMemo(
    () => filterDonors(allDonors, { area: query.city, bloodType: query.bloodType }).slice(0, 3),
    [query, allDonors],
  )

  const visibleBanks = showAllBanks ? banks : banks.slice(0, 2)
  const donorQuery = new URLSearchParams()
  if (query.city) donorQuery.set('area', query.city)
  if (query.bloodType) donorQuery.set('bloodType', query.bloodType)
  const donorsHref = `/donors${donorQuery.toString() ? `?${donorQuery}` : ''}`

  return (
    <Layout>
      <section className="relative overflow-hidden bg-navy text-white">
        <img
          src="https://images.unsplash.com/photo-1615461066841-6116ee365664?auto=format&fit=crop&w=1800&q=80"
          alt="Medical staff preparing a blood donation"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(11,36,71,0.95)_0%,rgba(11,36,71,0.82)_50%,rgba(225,29,45,0.72)_100%)]" />
        <div className={`relative ${pageWidth} grid items-center gap-8 py-14 pb-24 sm:py-16 sm:pb-28 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:py-20`}>
          <div>
            <p className="m-0 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-white uppercase">
              Patients · Donors · Doctors
            </p>
            <h1 className="mt-4 mb-0 max-w-3xl text-[clamp(32px,6vw,56px)] leading-[1.08] font-extrabold tracking-tight text-white">
              One network when blood and care cannot wait
            </h1>
            <p className="mt-4 mb-0 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
              Patients request, donors respond, doctors advise. Find a match, check live units, and get
              free medical support in the same place.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to={isLoggedIn ? '/dashboard/request-blood' : '/requests'}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 font-extrabold text-brand no-underline hover:bg-rose-50"
              >
                I need blood
              </Link>
              <Link
                to="/donors"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/40 px-6 font-extrabold text-white no-underline hover:bg-white/10"
              >
                Find a donor
              </Link>
            </div>
          </div>

          <aside className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-md sm:p-6">
            <p className="m-0 text-xs font-extrabold tracking-wide text-white/75 uppercase">Emergency</p>
            <h2 className="mt-2 mb-1 text-xl font-extrabold text-white">Need help now?</h2>
            <p className="m-0 text-sm leading-relaxed text-white/85">
              Call 999, pick a blood group to search donors, or reach a volunteer doctor.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <a
                href="tel:999"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-white font-extrabold text-brand no-underline hover:bg-rose-50"
              >
                Call 999
              </a>
              <Link
                to="/doctors"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/40 font-extrabold text-white no-underline hover:bg-white/10"
              >
                Call a doctor
              </Link>
            </div>
            <p className="mt-5 mb-2 text-xs font-bold tracking-wide text-white/75 uppercase">Jump to a blood group</p>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`h-10 rounded-md text-sm font-extrabold transition ${
                    bloodType === type
                      ? 'bg-white text-brand'
                      : 'bg-brand text-white hover:bg-brand-hover'
                  }`}
                  onClick={() => {
                    setBloodType(type)
                    document.getElementById('search')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <div id="search" className={`relative z-10 ${pageWidth} -mt-16`}>
        <form className={`${cardClass} p-4 sm:p-6`} onSubmit={handleSearch}>
          <h2 className="mb-1 text-lg font-extrabold sm:text-xl">Find donors near you</h2>
          <p className="mt-0 mb-4 text-sm text-slate-500 dark:text-slate-400">
            Search by area and blood group. Availability is on every donor card.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1.4fr_0.8fr_auto]">
            <label className="sr-only" htmlFor="search-city">City or area</label>
            <input
              id="search-city"
              type="text"
              placeholder="City or area"
              value={city}
              className={inputClass}
              onChange={(event) => setCity(event.target.value)}
            />
            <label className="sr-only" htmlFor="search-type">Blood type</label>
            <select
              id="search-type"
              value={bloodType}
              className={inputClass}
              onChange={(event) => setBloodType(event.target.value)}
            >
              <option value="">All blood types</option>
              {BLOOD_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <button type="submit" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 font-extrabold text-white hover:bg-brand-hover sm:col-span-2 xl:col-span-1 xl:w-auto">
              Search
            </button>
          </div>
        </form>
      </div>

      <section className={`${pageWidth} pt-10`}>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {HOME_STATS.map(([value, label]) => (
            <article key={label} className={`${cardClass} px-4 py-5 text-center`}>
              <p className="m-0 text-2xl font-extrabold text-brand sm:text-3xl">{value}</p>
              <p className="mt-1 mb-0 text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${pageWidth} pt-14 sm:pt-16`}>
        <SectionHeader
          eyebrow="The network"
          title="Everyone has a role that saves a life"
          subtitle="Patients ask. Donors give. Doctors keep the process safe."
        />
        <NetworkRoles />
      </section>

      {urgent.length ? (
        <section className={`${pageWidth} pt-14 sm:pt-16`} id="requests">
          <SectionHeader
            eyebrow="Patients"
            title="Urgent blood requests"
            subtitle="Live asks from members. Matching donors get these on their dashboard."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {urgent.map((request) => (
              <RequestCard key={request.id} request={request} mode="feed" />
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Link to="/requests" className={`${btnOutline} h-11 px-6 no-underline`}>See all requests</Link>
          </div>
        </section>
      ) : null}

      <section className={`${pageWidth} pt-12 pb-6 sm:pt-16`} id="donors">
        <SectionHeader
          eyebrow="Donors"
          title="Recent donors in your area"
          subtitle="See who is available now, or how long until they can donate again."
        />
        {donors.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {donors.map((donor) => (
              <DonorCard key={donor.id} donor={donor} />
            ))}
          </div>
        ) : (
          <p className={`${cardClass} px-5 py-10 text-center text-slate-500`}>No donors matched that area and blood type yet.</p>
        )}
        <div className="mt-6 flex justify-center">
          <Link to={donorsHref} className={`${btnOutline} h-11 px-6 no-underline`}>See all donors</Link>
        </div>
      </section>

      <section className={`${pageWidth} pt-14 pb-6 sm:pt-16`} id="availability">
        <SectionHeader
          eyebrow="Blood banks"
          title="Units near you"
          subtitle="If a donor is still waiting, check live inventory from partner hospitals."
        />
        <div className="grid gap-4">
          {visibleBanks.map((bank) => (
            <article key={bank.id} className={`${cardClass} p-4 sm:p-5`}>
              <div className="mb-4 flex flex-col justify-between gap-3 sm:gap-4 md:flex-row md:items-start">
                <div>
                  <h3 className="m-0 text-base font-extrabold sm:text-lg">{bank.name}</h3>
                  <p className="mt-1 mb-0 text-sm text-slate-500">{bank.distance} away</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a className={`${btnOutline} flex-1 sm:flex-none`} href={bank.map} target="_blank" rel="noreferrer">Directions</a>
                  <a className={`${btnOutline} flex-1 sm:flex-none`} href={`tel:${bank.phone}`}>Call now</a>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
                {BLOOD_TYPES.map((type) => (
                  <div
                    key={type}
                    className={`rounded-xl border px-1.5 py-2.5 text-center ${
                      query.bloodType === type
                        ? 'border-brand bg-rose-50 dark:bg-brand/15'
                        : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-panel-2'
                    }`}
                  >
                    <BloodTypeBadge type={type} size="sm" className="mx-auto" />
                    <span className="mt-1 block text-xs text-slate-500">{bank.units?.[type] ?? 0} Units</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
        {banks.length > 2 ? (
          <div className="mt-6 flex justify-center">
            <button type="button" className={`${btnOutline} h-11 px-6`} onClick={() => setShowAllBanks((open) => !open)}>
              {showAllBanks ? 'Show fewer banks' : 'See more blood banks'}
            </button>
          </div>
        ) : null}
      </section>

      <section className={`${pageWidth} pt-12 sm:pt-16`} id="doctors">
        <SectionHeader
          eyebrow="Doctors"
          title="Free care for donors and patients"
          subtitle="Volunteer physicians on call for eligibility, recovery, and emergencies."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Link to="/doctors" className={`${btnOutline} h-11 px-6 no-underline`}>See all doctors</Link>
        </div>
      </section>

      <section className={`${pageWidth} pt-12 sm:pt-16`}>
        <SectionHeader
          eyebrow="How it works"
          title="Three people. One outcome."
          subtitle="A request, a match, and medical cover — without leaving BloodConnector."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {HOW_IT_WORKS.map((item) => (
            <article key={item.step} className={`${cardClass} p-6`}>
              <p className="m-0 text-[11px] font-bold tracking-[0.2em] text-brand uppercase">{item.kicker}</p>
              <p className="mt-3 mb-0 grid h-10 w-10 place-items-center rounded-full bg-brand text-sm font-extrabold text-white">
                {item.step}
              </p>
              <h3 className="mt-4 mb-2 text-lg font-extrabold">{item.title}</h3>
              <p className="m-0 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <OpinionSlider />
    </Layout>
  )
}
