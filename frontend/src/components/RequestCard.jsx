import { Link } from 'react-router-dom'
import DonorAvatar from './DonorAvatar.jsx'
import BloodTypeBadge from './BloodTypeBadge.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { btnOutline, cardClass } from '../lib/classes.js'
import {
  closeRequest,
  contactRequester,
  dismissRequest,
  formatRequestTime,
  matchesBloodGroup,
  setResponseStatus,
  userIdFrom,
} from '../lib/requests.js'

function urgencyClass(level) {
  if (level === 'Critical') return 'bg-rose-100 text-brand dark:bg-brand/20'
  if (level === 'High') return 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300'
  return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200'
}

function statusLabel(status) {
  if (status === 'matched') return 'Donor matched'
  if (status === 'closed') return 'Closed'
  if (status === 'contacted') return 'Contacted'
  return 'Open'
}

export default function RequestCard({ request, mode = 'feed', showResponses = false }) {
  const { user, isLoggedIn } = useAuth()
  const myId = userIdFrom(user)
  const isOwner = Boolean(myId && request.requesterId === myId)
  const isMatch = isLoggedIn && !isOwner && matchesBloodGroup(user?.bloodGroup, request.bloodType)
  const view = showResponses || isOwner ? 'owner' : mode

  async function handleContact() {
    if (user) await contactRequester(request.id).catch(() => {})
  }

  return (
    <article className={`${cardClass} flex h-full flex-col p-4 sm:p-5`}>
      <div className="flex items-start gap-3">
        <DonorAvatar name={request.requesterName} photo={request.requesterPhoto} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="m-0 flex flex-wrap items-center gap-2">
            <BloodTypeBadge type={request.bloodType} size="lg" />
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${urgencyClass(request.urgency)}`}>
              {request.urgency}
            </span>
          </p>
          <p className="mt-2 mb-0 text-[11px] font-bold tracking-wide text-slate-400 uppercase">Requested by</p>
          <h3 className="mt-0.5 mb-0 truncate text-base font-extrabold">{request.requesterName}</h3>
          <p className="mt-1 mb-0 text-sm text-slate-500 dark:text-slate-400">{request.location}</p>
          <p className="mt-1 mb-0 text-xs text-slate-400">{formatRequestTime(request.createdAt)}</p>
        </div>
      </div>

      {request.details ? (
        <p className={`mt-3 mb-0 text-sm leading-relaxed text-slate-600 dark:text-slate-300 ${view === 'feed' ? 'line-clamp-3' : ''}`}>
          {request.details}
        </p>
      ) : null}

      {view === 'feed' ? (
        isMatch ? (
          <div className="mt-auto pt-4">
            <Link
              to="/dashboard/open-requests"
              className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-brand px-4 text-sm font-bold text-white no-underline hover:bg-brand-hover"
            >
              Open in dashboard
            </Link>
          </div>
        ) : (
          <p className="mt-auto mb-0 flex flex-wrap items-center gap-1.5 pt-4 text-xs font-semibold text-slate-400">
            Matching <BloodTypeBadge type={request.bloodType} size="sm" /> donors see this on their dashboard.
          </p>
        )
      ) : null}

      {view === 'inbox' ? (
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <a
            href={`tel:${request.contact}`}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-brand px-4 text-sm font-bold text-white no-underline hover:bg-brand-hover"
            onClick={handleContact}
          >
            Contact
          </a>
          <button
            type="button"
            className={`${btnOutline} h-10 flex-1`}
            onClick={() => dismissRequest(request.id).catch(() => {})}
          >
            Cancel
          </button>
        </div>
      ) : null}

      {view === 'owner' ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={`tel:${request.contact}`} className={`${btnOutline} h-10 px-4 no-underline`}>
            Your contact: {request.contact}
          </a>
          {request.status === 'open' ? (
            <button
              type="button"
              className={`${btnOutline} h-10 px-4`}
              onClick={() => closeRequest(request.id, user, 'filled').catch(() => {})}
            >
              Mark as filled
            </button>
          ) : (
            <span className="inline-flex h-10 items-center text-sm font-bold text-slate-500">{statusLabel(request.status)}</span>
          )}
        </div>
      ) : null}

      {view === 'owner' && (request.responses || []).length ? (
        <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
          <p className="mt-0 mb-3 text-sm font-extrabold">
            {request.responses.length} matching donor {request.responses.length === 1 ? 'update' : 'updates'}
          </p>
          <ul className="m-0 list-none space-y-3 p-0">
            {(request.responses || []).map((offer) => (
              <li key={offer.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <div className="flex items-start gap-3">
                  <DonorAvatar name={offer.donorName} photo={offer.donorPhoto} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="m-0 flex flex-wrap items-center gap-2 font-bold">
                      {offer.donorName}
                      <BloodTypeBadge type={offer.donorBloodType} size="sm" />
                    </p>
                    <p className="mt-1 mb-0 text-xs font-semibold tracking-wide text-slate-400 uppercase">{statusLabel(offer.status)}</p>
                    {offer.donorPhone ? (
                      <a href={`tel:${offer.donorPhone}`} className="mt-2 inline-block text-sm font-bold text-brand no-underline hover:underline">
                        {offer.donorPhone}
                      </a>
                    ) : null}
                  </div>
                </div>
                {request.status === 'open' && offer.status === 'offered' ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="inline-flex h-9 items-center rounded-lg bg-brand px-3 text-sm font-bold text-white hover:bg-brand-hover"
                      onClick={() => setResponseStatus(request.id, offer.id, 'accepted', user).catch(() => {})}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      className={`${btnOutline} h-9`}
                      onClick={() => setResponseStatus(request.id, offer.id, 'declined', user).catch(() => {})}
                    >
                      Decline
                    </button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : view === 'owner' ? (
        <p className="mt-4 mb-0 text-sm text-slate-500">No matching donor has contacted you yet.</p>
      ) : null}
    </article>
  )
}
