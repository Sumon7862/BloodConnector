import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import PageHero from '../components/PageHero.jsx'
import DonorAvatar from '../components/DonorAvatar.jsx'
import OpinionEditor from '../components/OpinionEditor.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { formatOpinionDate, loadOpinions } from '../data/gallery.js'
import { btnPrimary, cardClass, inputClass, pageWidth } from '../lib/classes.js'

export default function Gallery() {
  const { user, isLoggedIn } = useAuth()
  const [opinions, setOpinions] = useState([])

  useEffect(() => {
    document.title = 'BloodConnector — Gallery'
  }, [])

  useEffect(() => {
    let cancelled = false
    function refresh() {
      loadOpinions().then((list) => { if (!cancelled) setOpinions(list) })
    }
    refresh()
    window.addEventListener('bloodconnector-opinions', refresh)
    return () => {
      cancelled = true
      window.removeEventListener('bloodconnector-opinions', refresh)
    }
  }, [])

  return (
    <Layout>
      <PageHero eyebrow="Gallery" title="Community gallery">
        Patients, donors, and doctors share short notes here. Post or edit yours anytime.
      </PageHero>

      <div className={`${pageWidth} py-10 sm:py-14`}>
        {isLoggedIn ? (
          <OpinionEditor user={user} inputClass={inputClass} onSaved={setOpinions} />
        ) : (
          <div className={`${cardClass} p-6 text-center`}>
            <h2 className="m-0 text-xl font-extrabold">Login to share your opinion</h2>
            <p className="mt-2 mb-5 text-sm text-slate-500 dark:text-slate-400">
              One opinion per member. Name, photo, and role come from your profile.
            </p>
            <div className="flex flex-col justify-center gap-2 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 px-5 font-bold text-slate-800 no-underline hover:border-brand hover:text-brand dark:border-slate-600 dark:text-slate-100"
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
              {opinions.length} {opinions.length === 1 ? 'story' : 'stories'} from the network
            </p>
          </header>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {opinions.length ? opinions.map((item) => (
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
            )) : (
              <p className={`${cardClass} px-5 py-10 text-center text-slate-500 sm:col-span-2 xl:col-span-3`}>
                No community stories yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </Layout>
  )
}
