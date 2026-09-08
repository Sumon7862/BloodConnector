import { Link } from 'react-router-dom'
import { cardClass, cardHover } from '../lib/classes.js'

export default function DoctorCard({ doctor }) {
  return (
    <article className={`${cardClass} ${cardHover} overflow-hidden`}>
      <img src={doctor.photo} alt="" className="h-52 w-full object-cover" />
      <div className="p-5">
        <p className="m-0 text-[11px] font-bold tracking-[0.18em] text-brand uppercase">Volunteer doctor</p>
        <h3 className="mt-2 mb-1 text-lg font-extrabold">{doctor.name}</h3>
        <p className="mt-0 mb-4 line-clamp-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {doctor.specialization}
        </p>
        <div className="flex gap-2">
          <a
            href={`tel:${doctor.phone}`}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white no-underline hover:bg-brand-hover"
          >
            Call
          </a>
          <Link
            to={`/doctors/${doctor.id}`}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-slate-300 text-sm font-bold text-slate-700 no-underline hover:border-brand hover:text-brand dark:border-slate-600 dark:text-slate-200"
          >
            Profile
          </Link>
        </div>
      </div>
    </article>
  )
}
