import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import EmergencyDoctorHero from '../components/EmergencyDoctorHero.jsx'
import { DOCTORS } from '../data/doctors.js'
import { cardClass } from '../lib/classes.js'

export default function Doctors() {
  useEffect(() => {
    document.title = 'BloodConnector — Free Doctor Service'
  }, [])

  return (
    <Layout>
      <EmergencyDoctorHero />

      <section className="mx-auto w-[min(1180px,calc(100%-24px))] py-8 sm:w-[min(1180px,calc(100%-32px))] sm:py-12">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {DOCTORS.map((doctor) => (
            <article key={doctor.id} className={`${cardClass} overflow-hidden`}>
              <img
                src={doctor.photo}
                alt=""
                className="h-56 w-full object-cover sm:h-64"
              />
              <div className="flex flex-col items-center px-5 py-5 text-center">
                <h2 className="m-0 text-lg font-extrabold">{doctor.name}</h2>
                <p className="mt-3 mb-5 whitespace-pre-line text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {doctor.summary}
                </p>
                <Link
                  to={`/doctors/${doctor.id}`}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-5 text-sm font-semibold text-slate-700 no-underline hover:border-brand hover:text-brand dark:border-slate-600 dark:text-slate-200"
                >
                  More Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  )
}
