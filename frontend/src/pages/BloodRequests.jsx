import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import RequestCard from '../components/RequestCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { btnOutline, cardClass } from '../lib/classes.js'
import { openRequests, useRequests } from '../lib/requests.js'

export default function BloodRequests() {
  const { isLoggedIn } = useAuth()
  const requests = useRequests()
  const open = openRequests(requests)

  useEffect(() => {
    document.title = 'BloodConnector — Blood Requests'
  }, [])

  return (
    <Layout>
      <section className="relative overflow-hidden bg-brand text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.18),transparent_46%)]" aria-hidden="true" />
        <div className="relative mx-auto grid w-[min(1180px,calc(100%-24px))] items-center gap-6 py-12 sm:w-[min(1180px,calc(100%-32px))] sm:py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <h1 className="m-0 text-[clamp(32px,6vw,48px)] leading-tight font-extrabold tracking-tight text-white">
            Blood requests
          </h1>
          <p className="m-0 max-w-[640px] text-[15px] leading-relaxed text-white/95 sm:text-base">
            Each request shows who asked for blood. Donors with the same blood group receive it on
            their dashboard, where they can contact the requester or cancel.
          </p>
        </div>
      </section>

      <div className="mx-auto w-[min(1180px,calc(100%-24px))] py-8 sm:w-[min(1180px,calc(100%-32px))] sm:py-12">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0 text-sm text-slate-500 dark:text-slate-400">
            {open.length} open {open.length === 1 ? 'request' : 'requests'}
          </p>
          {isLoggedIn ? (
            <Link to="/dashboard/request-blood" className={`${btnOutline} h-10 px-4 no-underline`}>
              Submit a request
            </Link>
          ) : (
            <Link to="/login" state={{ from: '/dashboard/open-requests' }} className={`${btnOutline} h-10 px-4 no-underline`}>
              Login to respond
            </Link>
          )}
        </div>

        {open.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {open.map((request) => (
              <RequestCard key={request.id} request={request} mode="feed" />
            ))}
          </div>
        ) : (
          <p className={`${cardClass} px-5 py-10 text-center text-slate-500`}>
            No open blood requests right now.
          </p>
        )}
      </div>
    </Layout>
  )
}
