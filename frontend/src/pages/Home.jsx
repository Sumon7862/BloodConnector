import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import DonorCard from '../components/DonorCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import {
  BLOOD_TYPES,
  BLOOD_BANKS,
  HOME_STATS,
  HOW_IT_WORKS,
  IMPACT_CARDS,
} from '../data/homeData.js'
import { DONORS } from '../data/donors.js'
import { btnOutline, cardClass, inputClass } from '../lib/classes.js'

const impactVisual = {
  drive: 'bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.35),transparent_36%),linear-gradient(135deg,#fb7185,#9f1239)]',
  volunteer: 'bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.28),transparent_32%),linear-gradient(135deg,#38bdf8,#0b2447)]',
  donate: 'bg-[radial-gradient(circle_at_40%_60%,rgba(255,255,255,0.3),transparent_34%),linear-gradient(135deg,#fbbf24,#e11d2d)]',
}

export default function Home() {
  const { isLoggedIn } = useAuth()
  const [params] = useSearchParams()
  const [city, setCity] = useState(() => params.get('city') || '')
  const [bloodType, setBloodType] = useState(() => params.get('bloodType') || '')
  const [query, setQuery] = useState(() => ({
    city: params.get('city') || '',
    bloodType: params.get('bloodType') || '',
  }))
  const [showAllBanks, setShowAllBanks] = useState(false)

  useEffect(() => {
    document.title = 'BloodConnector'
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

  const donors = useMemo(() => {
    return DONORS.filter((donor) => {
      const cityOk = !query.city || donor.location.toLowerCase().includes(query.city.toLowerCase())
      const typeOk = !query.bloodType || donor.bloodType === query.bloodType
      return cityOk && typeOk
    }).slice(0, 3)
  }, [query])

  const visibleBanks = showAllBanks ? BLOOD_BANKS : BLOOD_BANKS.slice(0, 2)
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
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(11,36,71,0.94)_0%,rgba(11,36,71,0.78)_48%,rgba(225,29,45,0.7)_100%)]" />
        <div className="relative mx-auto grid w-[min(1180px,calc(100%-24px))] items-center gap-8 py-14 pb-24 sm:w-[min(1180px,calc(100%-32px))] sm:py-16 sm:pb-28 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:py-20">
          <div>
            <p className="m-0 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">
              Trusted blood donation network
            </p>
            <h1 className="mt-4 mb-0 max-w-3xl text-[clamp(32px,6vw,56px)] leading-[1.08] font-extrabold tracking-tight text-white">
              Save lives through verified blood donation
            </h1>
            <p className="mt-4 mb-0 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
              Find nearby donors, check live blood-bank units, and get free medical advice — all in one
              place, when every minute matters.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/donors"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-6 font-extrabold text-brand no-underline hover:bg-rose-50"
              >
                Find a donor
              </Link>
              <Link
                to={isLoggedIn ? '/dashboard' : '/signup'}
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/40 px-6 font-extrabold text-white no-underline hover:bg-white/10"
              >
                {isLoggedIn ? 'Go to dashboard' : 'Become a donor'}
              </Link>
            </div>
            <ul className="mt-8 mb-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 text-sm font-semibold text-white/80">
              <li>3,400+ verified donors</li>
              <li>48 partner banks</li>
              <li>Free 24/7 doctor support</li>
            </ul>
          </div>

          <aside className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-md sm:p-6">
            <p className="m-0 text-xs font-extrabold tracking-wide text-white/75 uppercase">Need blood now?</p>
            <h2 className="mt-2 mb-1 text-xl font-extrabold text-white">Emergency matching</h2>
            <p className="m-0 text-sm leading-relaxed text-white/85">
              Call national emergency services, or jump to a blood type and search nearby donors.
            </p>
            <a
              href="tel:999"
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-white font-extrabold text-brand no-underline hover:bg-rose-50"
            >
              Call 999
            </a>
            <p className="mt-5 mb-2 text-xs font-bold tracking-wide text-white/75 uppercase">Search by blood type</p>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  className="h-10 rounded-lg border border-white/25 bg-white/10 text-sm font-extrabold text-white transition hover:bg-white hover:text-brand"
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

      <div id="search" className="relative z-10 mx-auto -mt-16 w-[min(1180px,calc(100%-24px))] sm:w-[min(1180px,calc(100%-32px))]">
        <form className={`${cardClass} p-4 sm:p-6`} onSubmit={handleSearch}>
          <h2 className="mb-1 text-lg font-extrabold sm:text-xl">Find blood donors near you</h2>
          <p className="mt-0 mb-4 text-sm text-slate-500 dark:text-slate-400">Search by area and blood type to see matching donors below.</p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1.4fr_0.8fr_auto]">
            <label className="sr-only" htmlFor="search-city">City or area</label>
            <input
              id="search-city"
              type="text"
              placeholder="Enter your city or area"
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
            <button type="submit" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand px-6 font-extrabold text-white hover:bg-brand-hover sm:col-span-2 xl:col-span-1 xl:w-auto">
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-none stroke-current stroke-2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.2-3.2" />
              </svg>
              Search
            </button>
          </div>
        </form>
      </div>

      <section className="mx-auto w-[min(1180px,calc(100%-24px))] pt-10 sm:w-[min(1180px,calc(100%-32px))]">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {HOME_STATS.map(([value, label]) => (
            <article key={label} className={`${cardClass} px-4 py-5 text-center`}>
              <p className="m-0 text-2xl font-extrabold text-brand sm:text-3xl">{value}</p>
              <p className="mt-1 mb-0 text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-[min(1180px,calc(100%-24px))] pt-14 sm:w-[min(1180px,calc(100%-32px))] sm:pt-16">
        <header className="mb-8 text-center">
          <h2 className="m-0 text-[clamp(24px,3vw,32px)] font-extrabold tracking-tight">How BloodConnector works</h2>
          <p className="mt-2 mb-0 text-slate-500 dark:text-slate-400">Three clear steps from search to a safe donation.</p>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          {HOW_IT_WORKS.map((item) => (
            <article key={item.step} className={`${cardClass} p-5`}>
              <p className="m-0 grid h-10 w-10 place-items-center rounded-full bg-brand text-sm font-extrabold text-white">
                {item.step}
              </p>
              <h3 className="mt-4 mb-2 text-lg font-extrabold">{item.title}</h3>
              <p className="m-0 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-[min(1180px,calc(100%-24px))] pt-14 pb-6 sm:w-[min(1180px,calc(100%-32px))] sm:pt-16" id="availability">
        <header className="mb-7 text-center">
          <h2 className="m-0 text-[clamp(24px,3vw,32px)] font-extrabold tracking-tight">Blood availability in your area</h2>
          <p className="mt-2 mb-0 text-slate-500 dark:text-slate-400">
            Live inventory from verified blood banks and hospitals near you.
          </p>
        </header>
        <div className="grid gap-4">
          {visibleBanks.map((bank) => (
            <article key={bank.id} className={`${cardClass} p-4 sm:p-5`}>
              <div className="mb-4 flex flex-col justify-between gap-3 sm:gap-4 md:flex-row md:items-start">
                <div>
                  <h3 className="m-0 flex items-center gap-2 text-base font-extrabold sm:text-lg">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand shadow-[0_0_0_4px_rgba(225,29,45,0.15)]" aria-hidden="true" />
                    {bank.name}
                  </h3>
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
                    className={`rounded-lg border px-1.5 py-2.5 text-center ${
                      query.bloodType === type
                        ? 'border-brand bg-rose-50 dark:bg-brand/15'
                        : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-panel-2'
                    }`}
                  >
                    <strong className="block text-[15px] text-brand">{type}</strong>
                    <span className="mt-1 block text-xs text-slate-500">{bank.units[type]} Units</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
        {BLOOD_BANKS.length > 2 ? (
          <div className="mt-6 flex justify-center">
            <button type="button" className={`${btnOutline} h-11 px-6`} onClick={() => setShowAllBanks((open) => !open)}>
              {showAllBanks ? 'Show fewer banks' : 'See more blood banks'}
            </button>
          </div>
        ) : null}
      </section>

      <section className="mx-auto w-[min(1180px,calc(100%-24px))] pt-12 pb-6 sm:w-[min(1180px,calc(100%-32px))] sm:pt-16" id="donors">
        <header className="mb-7 text-center">
          <h2 className="m-0 text-[clamp(24px,3vw,32px)] font-extrabold tracking-tight">Recent donors in your area</h2>
          <p className="mt-2 mb-0 text-slate-500 dark:text-slate-400">
            See who is available now, or how long until they can donate again.
          </p>
        </header>
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

      <section className="mt-12 bg-brand py-14 text-white" id="impact">
        <h2 className="mx-auto mb-3 w-[min(1180px,calc(100%-24px))] text-center text-[clamp(24px,3vw,32px)] font-extrabold text-white sm:w-[min(1180px,calc(100%-32px))]">
          More ways you can make a difference
        </h2>
        <p className="mx-auto mb-8 max-w-2xl w-[min(1180px,calc(100%-24px))] text-center text-sm text-white/85 sm:w-[min(1180px,calc(100%-32px))]">
          Donate, volunteer, or share your story. Every action helps someone reach a hospital in time.
        </p>
        <div className="mx-auto grid w-[min(1180px,calc(100%-24px))] gap-4 sm:w-[min(1180px,calc(100%-32px))] sm:grid-cols-2 xl:grid-cols-3">
          {IMPACT_CARDS.map((card) => (
            <article key={card.id} className="overflow-hidden rounded-[14px] bg-white text-slate-900 dark:bg-panel dark:text-slate-100">
              <div className={`h-[150px] ${impactVisual[card.id]}`} aria-hidden="true" />
              <div className="px-5 pt-4 pb-5">
                <h3 className="m-0 text-[17px] font-extrabold">{card.title}</h3>
                <p className="mt-2 mb-4 text-sm text-slate-500 dark:text-slate-400">{card.copy}</p>
                <Link to={card.to} className="font-extrabold text-brand no-underline hover:underline">
                  {card.action}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-[min(1180px,calc(100%-24px))] pt-12 pb-16 sm:w-[min(1180px,calc(100%-32px))] sm:pt-16" id="doctors">
        <header className="mb-7 text-center">
          <h2 className="m-0 text-[clamp(24px,3vw,32px)] font-extrabold tracking-tight">Free doctor service</h2>
          <p className="mt-2 mb-0 text-slate-500 dark:text-slate-400">
            Talk to licensed physicians about eligibility, recovery, and post-donation care.
          </p>
        </header>
        <div className={`${cardClass} overflow-hidden md:grid md:grid-cols-[0.9fr_1.1fr]`}>
          <img
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80"
            alt="Physician available for a BloodConnector tele-consult"
            className="h-52 w-full object-cover md:h-full"
          />
          <div className="flex flex-col justify-center p-5 sm:p-8">
            <p className="m-0 text-xs font-extrabold tracking-wide text-brand uppercase">24/7 tele-consult</p>
            <h3 className="mt-2 mb-2 text-xl font-extrabold">Care for donors and patients</h3>
            <p className="m-0 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              No charge for BloodConnector members during emergency matching. Phone, video, or chat with a certified doctor.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Link to="/doctors" className="inline-flex h-11 items-center justify-center rounded-lg bg-brand px-6 font-extrabold text-white no-underline hover:bg-brand-hover">
                Talk to a doctor
              </Link>
              <a href="tel:999" className={`${btnOutline} h-11 px-6 no-underline`}>
                Emergency 999
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
