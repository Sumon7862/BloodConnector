import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashPageHead from '../../components/DashPageHead.jsx'
import DonationCountdown from '../../components/DonationCountdown.jsx'
import RequestCard from '../../components/RequestCard.jsx'
import BloodTypeBadge from '../../components/BloodTypeBadge.jsx'
import NetworkRoles from '../../components/NetworkRoles.jsx'
import { Icon } from '../../components/DashIcons.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { roleLabel } from '../../lib/user.js'
import { btnOutline, cardClass } from '../../lib/classes.js'
import { DONATION_WAIT_DAYS, isDonationEligible, markDonatedNow } from '../../lib/eligibility.js'
import { matchingRequestsFor, useRequests } from '../../lib/requests.js'

export default function DashboardHome() {
  const { user, updateUser } = useAuth()
  const requests = useRequests()
  const isDoctor = user.role === 'doctor'
  const firstName = String(user.name || 'there').split(' ')[0]
  const eligible = isDonationEligible(user.nextEligibleAt)
  const liveRequests = matchingRequestsFor(user, requests).slice(0, 3)

  useEffect(() => {
    document.title = 'BloodConnector — Dashboard'
  }, [])

  const metrics = isDoctor
    ? [
        ['Consultations', user.consultations || 48, 'consult', 'Patients and donors you advised'],
        ['Patients helped', 36, 'user', 'Emergency and recovery calls'],
        ['Rating', '4.8', 'star', 'From member reviews'],
        ['Experience', `${user.experience || 5} yrs`, 'clock', 'On the BloodConnector desk'],
      ]
    : [
        ['Donations', user.donationCount || 12, 'heart', 'Lives tied to your units'],
        ['Lives supported', 36, 'user', 'About 3 per donation'],
        ['Next eligible', eligible ? 'Now' : 'Wait', 'clock', eligible ? 'Ready to donate' : 'Countdown below'],
        ['Blood group', user.bloodGroup || '—', 'drop', 'Used to match patient requests'],
      ]

  return (
    <div>
      <DashPageHead
        title={`Welcome back, ${firstName}`}
        subtitle={
          isDoctor
            ? 'Patients and donors are counting on your advice. Keep the consultation desk open.'
            : 'Answer matching requests, stay eligible, and call a doctor if you need cover.'
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, icon, note]) => (
          <article key={label} className={`${cardClass} p-4`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="m-0 text-sm text-slate-500">{label}</p>
                <p className="mt-1 mb-0 text-3xl font-extrabold">
                  {label === 'Blood group' && user.bloodGroup ? (
                    <BloodTypeBadge type={user.bloodGroup} size="lg" />
                  ) : (
                    value
                  )}
                </p>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand text-white">
                <Icon name={icon} className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 mb-0 text-xs font-semibold text-slate-500">{note}</p>
          </article>
        ))}
      </div>

      {!isDoctor ? (
        <section className={`${cardClass} mt-5 p-5 sm:p-6`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="m-0 text-lg font-extrabold">Your availability</h2>
              <p className="mt-1 mb-0 text-sm text-slate-500">
                Whole blood donors wait {DONATION_WAIT_DAYS} days. Patients only see you as available when this is clear.
              </p>
            </div>
            <button
              type="button"
              className={`${btnOutline} h-10`}
              onClick={() => updateUser({
                ...markDonatedNow(),
                donationCount: (Number(user.donationCount) || 0) + 1,
              })}
            >
              I donated today
            </button>
          </div>
          <div className="mx-auto mt-4 max-w-lg">
            <DonationCountdown until={user.nextEligibleAt} />
          </div>
        </section>
      ) : null}

      {isDoctor ? (
        <section className={`${cardClass} mt-6 p-5 sm:p-6`}>
          <h2 className="m-0 text-lg font-extrabold">Your consultation desk</h2>
          <p className="mt-2 mb-4 text-sm text-slate-500">
            Donors check eligibility with you. Patients call when a match is in progress. Keep your number and hospital current in Profile.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link to="/dashboard/consultation" className="inline-flex h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-bold text-white no-underline hover:bg-brand-hover">
              Open consultation tools
            </Link>
            <Link to="/requests" className={`${btnOutline} h-11 px-5 no-underline`}>
              View live patient requests
            </Link>
          </div>
        </section>
      ) : null}

      <section className="mt-6">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="m-0 text-lg font-extrabold">Patients waiting for a match</h2>
            {user.bloodGroup ? <BloodTypeBadge type={user.bloodGroup} size="sm" /> : null}
          </div>
          <Link to="/dashboard/open-requests" className="text-sm font-bold text-brand no-underline hover:underline">
            See all
          </Link>
        </div>
        {liveRequests.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {liveRequests.map((item) => (
              <RequestCard key={item.id} request={item} mode="inbox" />
            ))}
          </div>
        ) : (
          <p className={`${cardClass} px-5 py-8 text-center text-sm text-slate-500`}>
            {user.bloodGroup ? (
              <>
                No open <BloodTypeBadge type={user.bloodGroup} size="sm" /> requests right now.
              </>
            ) : (
              'Add your blood group in Profile to receive matching patient requests.'
            )}
          </p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-extrabold">Keep the network moving</h2>
        <NetworkRoles />
      </section>

      <p className="mt-6 mb-0 text-center text-xs text-slate-400">Signed in as {roleLabel(user.role)}</p>
    </div>
  )
}
