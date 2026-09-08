import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import DashPageHead from '../../components/DashPageHead.jsx'
import RequestCard from '../../components/RequestCard.jsx'
import BloodTypeBadge from '../../components/BloodTypeBadge.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { btnOutline } from '../../lib/classes.js'
import { matchingRequestsFor, useRequests } from '../../lib/requests.js'

export default function OpenRequests() {
  const { user } = useAuth()
  const requests = useRequests()
  const visible = useMemo(() => matchingRequestsFor(user, requests), [requests, user])

  useEffect(() => {
    document.title = 'BloodConnector — Matching Requests'
  }, [])

  return (
    <div>
      <DashPageHead
        title="Matching Requests"
        subtitle={
          user.bloodGroup ? (
            <>
              Only <BloodTypeBadge type={user.bloodGroup} size="sm" /> requests appear here. Contact the requester, or cancel if you cannot help.
            </>
          ) : (
            'Add your blood group in Profile to receive matching requests.'
          )
        }
        action={
          <Link to="/dashboard/request-blood" className={`${btnOutline} h-10 px-4 no-underline`}>
            Request blood
          </Link>
        }
      />
      {!user.bloodGroup ? (
        <p className="rounded-[14px] border border-slate-200 bg-white px-5 py-10 text-center text-slate-500 dark:border-slate-700 dark:bg-panel">
          <Link to="/dashboard/profile" className="font-bold text-brand no-underline hover:underline">
            Update your blood group
          </Link>{' '}
          to see requests that match you.
        </p>
      ) : visible.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((request) => (
            <RequestCard key={request.id} request={request} mode="inbox" />
          ))}
        </div>
      ) : (
        <p className="rounded-[14px] border border-slate-200 bg-white px-5 py-10 text-center text-slate-500 dark:border-slate-700 dark:bg-panel">
          No open <BloodTypeBadge type={user.bloodGroup} size="sm" /> requests right now.
        </p>
      )}
    </div>
  )
}
