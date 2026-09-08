import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import PageHero from '../components/PageHero.jsx'
import RequestCard from '../components/RequestCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { btnOutline, cardClass, pageWidth } from '../lib/classes.js'
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
      <PageHero
        tone="brand"
        eyebrow="Patients"
        title="Open blood requests"
        actions={
          <div className="mt-5 flex flex-wrap gap-3">
            {isLoggedIn ? (
              <Link to="/dashboard/request-blood" className="inline-flex h-11 items-center rounded-xl bg-white px-5 font-bold text-brand no-underline hover:bg-rose-50">
                Submit a request
              </Link>
            ) : (
              <Link to="/login" state={{ from: '/dashboard/request-blood' }} className="inline-flex h-11 items-center rounded-xl bg-white px-5 font-bold text-brand no-underline hover:bg-rose-50">
                Login to request
              </Link>
            )}
          </div>
        }
      >
        Each ask shows who needs blood. Donors with the same group see it on their dashboard and can call or decline.
      </PageHero>

      <div className={`${pageWidth} py-10 sm:py-14`}>
        <p className="mb-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
          {open.length} open {open.length === 1 ? 'request' : 'requests'}
        </p>

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

        {!isLoggedIn ? (
          <p className="mt-6 text-center text-sm text-slate-500">
            Donors:{' '}
            <Link to="/login" state={{ from: '/dashboard/open-requests' }} className={`${btnOutline} ml-1 h-9 px-3 no-underline`}>
              Login to respond
            </Link>
          </p>
        ) : null}
      </div>
    </Layout>
  )
}
