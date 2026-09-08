import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import { BLOOD_TYPES } from '../data/homeData.js'
import {
  ABOUT_HERO,
  ABOUT_MISSION,
  ABOUT_VISION,
  WHAT_WE_DO,
  WHY_CHOOSE_US,
} from '../data/aboutData.js'
import { cardClass, inputClass } from '../lib/classes.js'

export default function About() {
  const navigate = useNavigate()
  const [city, setCity] = useState('')
  const [bloodType, setBloodType] = useState('')

  useEffect(() => {
    document.title = 'BloodConnector — About Us'
  }, [])

  function handleSearch(event) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (city.trim()) params.set('area', city.trim())
    if (bloodType) params.set('bloodType', bloodType)
    const query = params.toString()
    navigate(`/donors${query ? `?${query}` : ''}`)
  }

  return (
    <Layout>
      <section className="relative overflow-hidden bg-brand text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <svg viewBox="0 0 960 320" className="h-full w-full object-cover opacity-[0.22]" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="about-glow" cx="62%" cy="48%" r="48%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="960" height="320" fill="url(#about-glow)" />
            <g fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
              <path d="M430 214c-58-42-118-18-132 28-12 40 12 78 74 108 38 18 78 18 116 0" />
              <path d="M530 214c58-42 118-18 132 28 12 40-12 78-74 108-38 18-78 18-116 0" />
              <path d="M480 118c18-38 62-58 98-38 28 16 38 48 22 78-8 16-28 32-54 50l-66 48-66-48c-26-18-46-34-54-50-16-30-6-62 22-78 36-20 80 0 98 38Z" />
            </g>
            <circle cx="372" cy="86" r="46" fill="#fff" opacity="0.12" />
            <circle cx="628" cy="74" r="34" fill="#fff" opacity="0.1" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand/72 to-brand/88" />
        </div>

        <div className="relative mx-auto grid w-[min(1180px,calc(100%-24px))] items-center gap-6 py-12 sm:w-[min(1180px,calc(100%-32px))] sm:py-16 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16 lg:py-[72px]">
          <h1 className="m-0 text-[clamp(36px,6vw,56px)] leading-none font-extrabold tracking-tight text-white">
            About Us
          </h1>
          <p className="m-0 max-w-[720px] text-[15px] leading-relaxed text-white sm:text-base">
            {ABOUT_HERO}
          </p>
        </div>
      </section>

      <div className="bg-white dark:bg-ink">
        <div className="mx-auto w-[min(1180px,calc(100%-24px))] space-y-9 py-10 sm:w-[min(1180px,calc(100%-32px))] sm:space-y-11 sm:py-14">
          <section>
            <h2 className="m-0 text-xl font-extrabold tracking-tight sm:text-[22px]">Our Mission</h2>
            <p className="mt-3 max-w-4xl text-[15px] leading-relaxed text-slate-500 sm:text-base dark:text-slate-400">
              {ABOUT_MISSION}
            </p>
          </section>

          <section>
            <h2 className="m-0 text-xl font-extrabold tracking-tight sm:text-[22px]">Our Vision</h2>
            <p className="mt-3 max-w-4xl text-[15px] leading-relaxed text-slate-500 sm:text-base dark:text-slate-400">
              {ABOUT_VISION}
            </p>
          </section>

          <section>
            <h2 className="m-0 text-xl font-extrabold tracking-tight sm:text-[22px]">What We Do</h2>
            <ul className="mt-3 max-w-4xl list-disc space-y-2.5 pl-5 text-[15px] leading-relaxed sm:text-base">
              {WHAT_WE_DO.map((item) => (
                <li key={item.title} className="text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{item.title}:</span> {item.copy}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="m-0 text-xl font-extrabold tracking-tight sm:text-[22px]">Why Choose Us</h2>
            <ul className="mt-3 max-w-4xl list-disc space-y-2.5 pl-5 text-[15px] leading-relaxed sm:text-base">
              {WHY_CHOOSE_US.map((item) => (
                <li key={item.title} className="text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{item.title}:</span> {item.copy}
                </li>
              ))}
            </ul>
          </section>

          <form
            className={`${cardClass} border-rose-100 p-4 sm:p-6 dark:border-brand/25`}
            onSubmit={handleSearch}
          >
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-brand sm:text-xl">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.2-3.2" />
              </svg>
              Find Blood Donors Near You
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1.4fr_0.8fr_auto]">
              <label className="sr-only" htmlFor="about-search-city">City or zip code</label>
              <input
                id="about-search-city"
                type="text"
                placeholder="Enter your city or zip code"
                value={city}
                className={inputClass}
                onChange={(event) => setCity(event.target.value)}
              />
              <label className="sr-only" htmlFor="about-search-type">Blood type</label>
              <select
                id="about-search-type"
                value={bloodType}
                className={inputClass}
                onChange={(event) => setBloodType(event.target.value)}
              >
                <option value="">Blood Type</option>
                {BLOOD_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand px-6 font-extrabold text-white hover:bg-brand-hover sm:col-span-2 xl:col-span-1 xl:w-auto"
              >
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current stroke-2" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.2-3.2" />
                </svg>
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
