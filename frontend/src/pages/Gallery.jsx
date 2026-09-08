import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import DonorAvatar from '../components/DonorAvatar.jsx'
import OpinionEditor from '../components/OpinionEditor.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { formatOpinionDate, loadOpinions } from '../data/gallery.js'
import { btnPrimary, cardClass, inputClass } from '../lib/classes.js'

export default function Gallery() {
  const { user, isLoggedIn } = useAuth()
  const [opinions, setOpinions] = useState(() => loadOpinions())

  useEffect(() => {
    document.title = 'BloodConnector — Gallery'
  }, [])

  return (
    <Layout>
      <section className="relative overflow-hidden bg-brand text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.18),transparent_46%)]" aria-hidden="true" />
        <div className="relative mx-auto grid w-[min(1180px,calc(100%-24px))] items-center gap-6 py-12 sm:w-[min(1180px,calc(100%-32px))] sm:py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <h1 className="m-0 text-[clamp(32px,6vw,48px)] leading-tight font-extrabold tracking-tight text-white">
            Gallery
          </h1>
          <p className="m-0 max-w-[640px] text-[15px] leading-relaxed text-white/95 sm:text-base">
            Donors and doctors share one short opinion each (max 100 characters). You can edit yours
            anytime from the gallery or your dashboard.
          </p>
        </div>
      </section>

      <div className="mx-auto w-[min(1180px,calc(100%-24px))] py-8 sm:w-[min(1180px,calc(100%-32px))] sm:py-12">
        {isLoggedIn ? (
          <OpinionEditor user={user} inputClass={inputClass} onSaved={setOpinions} />
        ) : (
          <div className={`${cardClass} p-6 text-center`}>
            <h2 className="m-0 text-xl font-extrabold">Login to share your opinion</h2>
            <p className="mt-2 mb-5 text-sm text-slate-500 dark:text-slate-400">
              Each member can post one opinion. Your photo, name, address, and role come from your profile.
            </p>
            <div className="flex flex-col justify-center gap-2 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 px-5 font-bold text-slate-800 no-underline hover:border-brand hover:text-brand dark:border-slate-600 dark:text-slate-100"
              >
                Login
              </Link>
              <Link to="/signup" className={`${btnPrimary} sm:w-auto sm:px-8 no-underline`}>
                Create Account
              </Link>
            </div>
          </div>
        )}

        <section className="mt-10">
          <header className="mb-6">
            <h2 className="m-0 text-[clamp(22px,3vw,28px)] font-extrabold tracking-tight">Community voices</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {opinions.length} {opinions.length === 1 ? 'story' : 'stories'} from donors and doctors
            </p>
          </header>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {opinions.map((item) => (
              <article key={item.id} className={`${cardClass} flex flex-col p-5`}>
                <div className="flex items-start gap-3">
                  <DonorAvatar name={item.name} photo={item.photo} />
                  <div className="min-w-0 flex-1">
                    <h3 className="m-0 truncate text-base font-extrabold">{item.name}</h3>
                    <p className="mt-1 mb-0 text-sm text-slate-500 dark:text-slate-400">
                      {item.role}
                      {item.location ? ` · ${item.location}` : ''}
                    </p>
                  </div>
                </div>
                <p className="mt-3 mb-0 text-amber-500" aria-label={`${item.rating} out of 5 stars`}>
                  {'★'.repeat(item.rating)}
                  <span className="text-slate-300 dark:text-slate-600">{'★'.repeat(5 - item.rating)}</span>
                </p>
                <p className="mt-3 mb-0 flex-1 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                  “{item.opinion}”
                </p>
                <p className="mt-4 mb-0 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  {item.updatedAt && item.updatedAt !== item.createdAt
                    ? `Updated ${formatOpinionDate(item.updatedAt)}`
                    : formatOpinionDate(item.createdAt)}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}
