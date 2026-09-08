import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import DonorAvatar from '../components/DonorAvatar.jsx'
import { BLOOD_TYPES, BLOOD_BANKS, IMPACT_CARDS } from '../data/homeData.js'
import { DONORS } from '../data/donors.js'
import { btnOutline, cardClass, inputClass } from '../lib/classes.js'

const impactVisual = {
  drive: 'bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.35),transparent_36%),linear-gradient(135deg,#fb7185,#9f1239)]',
  volunteer: 'bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.28),transparent_32%),linear-gradient(135deg,#38bdf8,#0b2447)]',
  donate: 'bg-[radial-gradient(circle_at_40%_60%,rgba(255,255,255,0.3),transparent_34%),linear-gradient(135deg,#fbbf24,#e11d2d)]',
}

export default function Home() {
  const [params] = useSearchParams()
  const [city, setCity] = useState(() => params.get('city') || '')
  const [bloodType, setBloodType] = useState(() => params.get('bloodType') || '')
  const [query, setQuery] = useState(() => ({
    city: params.get('city') || '',
    bloodType: params.get('bloodType') || '',
  }))

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
    document.getElementById('availability')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const donors = useMemo(() => {
    return DONORS.filter((donor) => {
      const cityOk = !query.city || donor.location.toLowerCase().includes(query.city.toLowerCase())
      const typeOk = !query.bloodType || donor.bloodType === query.bloodType
      return cityOk && typeOk
    }).slice(0, 3)
  }, [query])

  return (
    <Layout>
      <section className="flex min-h-[340px] items-center bg-[linear-gradient(180deg,rgba(190,18,45,0.72),rgba(190,18,45,0.86)),repeating-linear-gradient(135deg,rgba(255,255,255,0.05)_0_12px,transparent_12px_24px)] bg-brand text-white">
        <div className="mx-auto flex w-[min(1180px,calc(100%-24px))] items-center justify-between gap-8 py-10 pb-20 sm:w-[min(1180px,calc(100%-32px))] sm:py-14 sm:pb-24">
          <div className="max-w-[620px]">
            <h1 className="m-0 text-[clamp(28px,8vw,52px)] leading-[1.12] font-extrabold tracking-tight text-white">
              Save Life Through Blood Donation
            </h1>
            <p className="mt-4 max-w-[520px] text-base leading-relaxed text-white/90">
              Connect with verified blood donors in your area. Every donation can save up to 3 lives.
              Join our community of life-savers today.
            </p>
          </div>
          <div className="relative hidden h-[220px] w-[min(360px,38%)] overflow-hidden rounded-[18px] border border-white/20 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.28),transparent_34%)] md:block" aria-hidden="true">
            <span className="absolute top-[54px] left-12 h-[92px] w-[92px] rounded-full bg-white/20" />
            <span className="absolute top-[72px] right-14 h-[72px] w-[72px] rounded-full bg-white/20" />
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-[58px] w-[min(1180px,calc(100%-24px))] sm:w-[min(1180px,calc(100%-32px))]">
        <form className={`${cardClass} p-4 sm:p-[22px]`} onSubmit={handleSearch}>
          <h2 className="mb-3.5 text-lg font-bold text-brand sm:text-xl">Find Blood Donors Near You</h2>
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
              <option value="">Blood type</option>
              {BLOOD_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <button type="submit" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand px-6 font-extrabold text-white hover:bg-brand-hover sm:col-span-2 xl:col-span-1 xl:w-auto">
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current stroke-2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.2-3.2" />
              </svg>
              Search
            </button>
          </div>
        </form>
      </div>

      <section className="mx-auto w-[min(1180px,calc(100%-24px))] pt-12 pb-6 sm:w-[min(1180px,calc(100%-32px))] sm:pt-16" id="availability">
        <header className="mb-7 text-center">
          <h2 className="m-0 text-[clamp(24px,3vw,32px)] tracking-tight">Blood Availability In Your Area</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Real-time blood inventory from verified blood banks and hospital in your area.</p>
        </header>
        <div className="grid gap-[18px]">
          {BLOOD_BANKS.map((bank) => (
            <article key={bank.id} className={`${cardClass} p-4 sm:p-5`}>
              <div className="mb-4 flex flex-col justify-between gap-3 sm:gap-4 md:flex-row md:items-start">
                <div>
                  <h3 className="m-0 flex items-center gap-2 text-base sm:text-lg">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand shadow-[0_0_0_4px_rgba(225,29,45,0.15)]" aria-hidden="true" />
                    {bank.name}
                  </h3>
                  <small className="text-slate-500">{bank.distance} away</small>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a className={`${btnOutline} flex-1 sm:flex-none`} href={bank.map} target="_blank" rel="noreferrer">Direction</a>
                  <a className={`${btnOutline} flex-1 sm:flex-none`} href={`tel:${bank.phone}`}>Call Now</a>
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
        <div className="mt-[22px] flex justify-center">
          <button type="button" className={`${btnOutline} h-[42px] px-[22px]`}>See More</button>
        </div>
      </section>

      <section className="mx-auto w-[min(1180px,calc(100%-24px))] pt-12 pb-6 sm:w-[min(1180px,calc(100%-32px))] sm:pt-16" id="donors">
        <header className="mb-7 text-center">
          <h2 className="m-0 text-[clamp(24px,3vw,32px)] tracking-tight">Recent Donors In Your Area</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Connect with the verified donors and see their availability.</p>
        </header>
        {donors.length ? (
          <div className="grid gap-[18px] sm:grid-cols-2 xl:grid-cols-3">
            {donors.map((donor) => (
              <article key={donor.id} className={`${cardClass} p-5`}>
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                  <DonorAvatar name={donor.name} photo={donor.photo} size="sm" />
                  <div>
                    <h3 className="m-0 text-base">{donor.name}</h3>
                    <p className="mt-1 text-[13px] text-slate-500">{donor.location}</p>
                  </div>
                  <span className="rounded-md bg-brand px-2 py-1.5 text-[13px] font-extrabold text-white">{donor.bloodType}</span>
                </div>
                <dl className="my-4">
                  <div className="flex justify-between gap-3 py-1.5 text-sm">
                    <dt className="font-medium text-slate-500">Last Donation</dt>
                    <dd className="m-0 font-bold">{donor.lastDonation}</dd>
                  </div>
                  <div className="flex justify-between gap-3 py-1.5 text-sm">
                    <dt className="font-medium text-slate-500">Next Eligible</dt>
                    <dd className="m-0 font-bold text-emerald-600 dark:text-emerald-400">{donor.nextEligible}</dd>
                  </div>
                </dl>
                <div className="grid grid-cols-2 gap-2">
                  <a href={`tel:${donor.phone}`} className={`${btnOutline} w-full`}>Contact</a>
                  <Link to={`/donors/${donor.id}`} className={`${btnOutline} w-full`}>Donor History</Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500">No donors matched that city and blood type yet.</p>
        )}
        <div className="mt-[22px] flex justify-center">
          <Link to="/donors" className={`${btnOutline} h-[42px] px-[22px] no-underline`}>See All Donors</Link>
        </div>
      </section>

      <section className="mt-12 bg-brand py-14 text-white" id="campaigns">
        <h2 className="mx-auto mb-7 w-[min(1180px,calc(100%-24px))] text-center text-[clamp(24px,3vw,32px)] text-white sm:w-[min(1180px,calc(100%-32px))]">
          More Way You can Make An Difference
        </h2>
        <div className="mx-auto grid w-[min(1180px,calc(100%-24px))] gap-[18px] sm:w-[min(1180px,calc(100%-32px))] sm:grid-cols-2 xl:grid-cols-3">
          {IMPACT_CARDS.map((card) => (
            <article key={card.id} className="overflow-hidden rounded-[14px] bg-white text-slate-900 dark:bg-panel dark:text-slate-100">
              <div className={`h-[150px] ${impactVisual[card.id]}`} aria-hidden="true" />
              <div className="px-[18px] pt-4 pb-[18px]">
                <h3 className="m-0 text-[17px]">{card.title}</h3>
                <p className="mt-2 mb-3 text-sm text-slate-500 dark:text-slate-400">{card.copy}</p>
                <button type="button" className="border-0 bg-transparent p-0 font-extrabold text-brand">Learn More</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-[min(1180px,calc(100%-24px))] pt-12 pb-6 sm:w-[min(1180px,calc(100%-32px))] sm:pt-16" id="doctors">
        <header className="mb-7 text-center">
          <h2 className="m-0 text-[clamp(24px,3vw,32px)] tracking-tight">Free Doctor Service</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Talk to licensed physicians about eligibility, recovery, and post-donation care.</p>
        </header>
        <div className={`${cardClass} flex flex-col items-stretch justify-between gap-4 p-4 sm:p-[22px] md:flex-row md:items-center`}>
          <div>
            <h3 className="mb-1.5">24/7 tele-consult for donors and patients</h3>
            <p className="m-0 text-slate-500 dark:text-slate-400">No charge for BloodConnector members during emergency matching.</p>
          </div>
          <Link to="/doctors" className="inline-flex h-11 w-full shrink-0 items-center justify-center rounded-lg bg-brand px-6 font-extrabold text-white no-underline hover:bg-brand-hover md:w-auto">
            Book a call
          </Link>
        </div>
      </section>
    </Layout>
  )
}
