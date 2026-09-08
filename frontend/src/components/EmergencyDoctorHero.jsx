import { DOCTOR_HERO_COPY } from '../data/doctors.js'

export default function EmergencyDoctorHero() {
  return (
    <div className="mx-auto w-[min(1180px,calc(100%-24px))] pt-5 sm:w-[min(1180px,calc(100%-32px))] sm:pt-6">
      <section className="relative overflow-hidden rounded-xl bg-brand text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <svg viewBox="0 0 960 240" className="h-full w-full opacity-[0.18]" preserveAspectRatio="xMidYMid slice">
            <g fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round">
              <path d="M330 200c-70-80-40-150 20-150 42 0 70 38 100 80" />
              <path d="M630 200c70-80 40-150-20-150-42 0-70 38-100 80" />
              <path d="M460 150c-18-44 8-78 48-78s62 40 32 90" />
            </g>
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand/78 to-brand/90" />
        </div>
        <div className="relative grid items-center gap-6 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 lg:px-14">
          <h1 className="m-0 text-[clamp(28px,5vw,44px)] leading-tight font-extrabold tracking-tight text-white">
            Emergency Doctor Service
          </h1>
          <p className="m-0 max-w-[620px] text-[15px] leading-relaxed text-white sm:text-base">
            {DOCTOR_HERO_COPY}
          </p>
        </div>
      </section>
    </div>
  )
}
