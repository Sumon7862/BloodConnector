import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashPageHead from '../../components/DashPageHead.jsx'
import { Icon } from '../../components/DashIcons.jsx'
import DonorAvatar from '../../components/DonorAvatar.jsx'
import { cardClass } from '../../lib/classes.js'
import { CONSULT_DOCTORS } from '../../data/dashboardData.js'
import { DOCTORS } from '../../data/doctors.js'

const TYPES = [
  { id: 'phone', title: 'Phone Call', copy: 'Speak directly with a doctor.', action: 'Start Call', icon: 'phone' },
  { id: 'video', title: 'Video Call', copy: 'Face-to-face medical advice.', action: 'Start Video', icon: 'video' },
  { id: 'chat', title: 'Chat', copy: 'Message a doctor anytime.', action: 'Start Chat', icon: 'chat' },
]

export default function Consultation() {
  useEffect(() => {
    document.title = 'BloodConnector — Consultation'
  }, [])

  return (
    <div>
      <DashPageHead
        title="Medical Consultation"
        subtitle="Get free medical advice from certified healthcare professionals."
      />

      <section className="overflow-hidden rounded-xl bg-brand p-5 text-white sm:p-7">
        <div className="flex flex-col items-start gap-5 md:flex-row md:items-center">
          <img
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=240&q=80"
            alt=""
            className="h-24 w-24 rounded-full object-cover ring-4 ring-white/30"
          />
          <div>
            <h2 className="m-0 text-2xl font-extrabold text-white">Free Healthcare Support</h2>
            <p className="mt-2 mb-0 max-w-2xl text-sm leading-relaxed text-white/90">
              Consult with certified doctors before or after your blood donation. Get personalized health
              advice and answers to your questions.
            </p>
          </div>
        </div>
      </section>

      <h2 className="mt-8 mb-4 text-lg font-extrabold">Choose Consultation Type</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {TYPES.map((item) => (
          <article key={item.id} className={`${cardClass} px-5 py-6 text-center`}>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand text-white">
              <Icon name={item.icon} className="h-6 w-6" />
            </span>
            <h3 className="mt-4 mb-1 text-base font-extrabold">{item.title}</h3>
            <p className="m-0 text-sm text-slate-500">{item.copy}</p>
            <a
              href="tel:+8801712002001"
              className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-brand text-sm font-bold text-white no-underline hover:bg-brand-hover"
            >
              {item.action}
            </a>
          </article>
        ))}
      </div>

      <h2 className="mt-8 mb-4 text-lg font-extrabold">Available Doctors</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CONSULT_DOCTORS.map((doctor) => (
          <article key={doctor.id} className={`${cardClass} p-5 text-center`}>
            <DonorAvatar name={doctor.name} photo={doctor.photo} className="mx-auto h-20 w-20" />
            <h3 className="mt-3 mb-0 text-base font-extrabold">{doctor.name}</h3>
            <p className="mt-1 mb-0 text-sm text-slate-500">{doctor.specialty}</p>
            <p className="mt-2 mb-4 text-sm font-bold text-amber-500">★ {doctor.rating}</p>
            {doctor.available ? (
              <a
                href="tel:+8801712002001"
                className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-brand text-sm font-bold text-white no-underline hover:bg-brand-hover"
              >
                Consult Now
              </a>
            ) : (
              <span className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-zinc-200 text-sm font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                Unavailable
              </span>
            )}
          </article>
        ))}
      </div>

      <p className="mt-6 mb-0 text-center text-sm text-slate-500">
        See all listed physicians on the public{' '}
        <Link to="/doctors" className="font-bold text-brand no-underline hover:underline">
          Free Doctor Service
        </Link>{' '}
        page ({DOCTORS.length} doctors).
      </p>
    </div>
  )
}
