import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import DonorCard from '../components/DonorCard.jsx'
import OpinionSlider from '../components/OpinionSlider.jsx'
import RequestCard from '../components/RequestCard.jsx'
import NetworkRoles from '../components/NetworkRoles.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import {
  BLOOD_TYPES,
  HOW_IT_WORKS,
} from '../data/homeData.js'
import { fetchDonors } from '../lib/directory.js'
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
  const [allDonors, setAllDonors] = useState([])
  const liveStats = [
    [String(allDonors.length), 'Directory donors'],
    [String(openRequests(requests).length), 'Open requests'],
    [String(allDonors.filter((donor) => donor.status !== 'Inactive').length), 'Available now'],
    ['24/7', 'Request support'],
  ]

  useEffect(() => {
    document.title = 'BloodConnector'
  }, [])

  useEffect(() => {
    let cancelled = false
    fetchDonors().then((list) => { if (!cancelled) setAllDonors(list) })
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

  const donorQuery = new URLSearchParams()
  if (query.city) donorQuery.set('area', query.city)
  if (query.bloodType) donorQuery.set('bloodType', query.bloodType)
  const donorsHref = `/donors${donorQuery.toString() ? `?${donorQuery}` : ''}`

  return (
    <Layout>
      <section className="relative overflow-hidden bg-navy text-white">
        <img
          src="https://images.unsplash.com/photo-1615461066841-6116ee365664?auto=format&fit=crop&w=1800&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(11,36,71,0.95)_0%,rgba(11,36,71,0.82)_50%,rgba(225,29,45,0.72)_100%)]" />
        <div className={`relative ${pageWidth} grid items-center gap-8 py-14 pb-24 sm:py-16 sm:pb-28 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:py-20`}>
          <div>
            <p className="m-0 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-white uppercase">
              Request · Donate
            </p>
            <h1 className="mt-4 mb-0 max-w-3xl text-[clamp(32px,6vw,56px)] leading-[1.08] font-extrabold tracking-tight text-white">
              One network when blood cannot wait
            </h1>
            <p className="mt-4 mb-0 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
              Every member is a donor. Request blood when you need it, and donate when someone else does.
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
              Call 999, or pick a blood group to search donors near you.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <a
                href="tel:999"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-white font-extrabold text-brand no-underline hover:bg-rose-50"
              >
                Call 999
              </a>
              <Link
                to="/requests"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/40 font-extrabold text-white no-underline hover:bg-white/10"
              >
                See requests
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
          {liveStats.map(([value, label]) => (
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
          title="Every member can help both ways"
          subtitle="Request blood when you need it. Donate when a matching request comes in."
        />
        <NetworkRoles />
      </section>

      {urgent.length ? (
        <section className={`${pageWidth} pt-14 sm:pt-16`} id="requests">
          <SectionHeader
            eyebrow="Requests"
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

      <section className={`${pageWidth} pt-12 sm:pt-16`}>
        <SectionHeader
          eyebrow="How it works"
          title="Request. Match. Donate."
          subtitle="The same members ask for blood and give it — without leaving BloodConnector."
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
