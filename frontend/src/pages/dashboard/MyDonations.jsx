import { useEffect } from 'react'
import DashPageHead from '../../components/DashPageHead.jsx'
import DonationCountdown from '../../components/DonationCountdown.jsx'
import { Icon } from '../../components/DashIcons.jsx'
import { btnOutline, cardClass } from '../../lib/classes.js'
import { DONATION_HISTORY } from '../../data/dashboardData.js'
import { DONATION_WAIT_DAYS, markDonatedNow } from '../../lib/eligibility.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function MyDonations() {
  const { user, updateUser } = useAuth()
  const isDoctor = user.role === 'doctor'

  useEffect(() => {
    document.title = isDoctor ? 'BloodConnector — My Consultations' : 'BloodConnector — My Donations'
  }, [isDoctor])

  const items = isDoctor
    ? [
        { id: 'c1', title: 'Follow-up with donor eligibility', status: 'Completed', date: 'April 18, 2025', location: 'Tele consult' },
        { id: 'c2', title: 'Emergency patient advice', status: 'Upcoming', date: 'October 12, 2025', location: 'Phone call' },
      ]
    : DONATION_HISTORY

  return (
    <div>
      <DashPageHead
        title={isDoctor ? 'My Consultations' : 'My Donations'}
        subtitle={isDoctor ? 'Track completed and upcoming patient consults' : 'Track your donation history and upcoming appointments'}
      />
      {!isDoctor ? (
        <section className={`${cardClass} mb-5 p-5 sm:p-6`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="m-0 text-base font-extrabold">Availability countdown</h2>
              <p className="mt-1 mb-0 text-sm text-slate-500">
                You can donate again {DONATION_WAIT_DAYS} days after your last whole blood donation.
              </p>
            </div>
            <button
              type="button"
              className={`${btnOutline} h-10`}
              onClick={() => {
                updateUser({
                  ...markDonatedNow(),
                  donationCount: (Number(user.donationCount) || 0) + 1,
                }).catch(() => {})
              }}
            >
              I donated today
            </button>
          </div>
          <div className="mx-auto mt-4 max-w-lg">
            <DonationCountdown until={user.nextEligibleAt} />
          </div>
        </section>
      ) : null}
      <section className={`${cardClass} p-5 sm:p-6`}>
        <h2 className="m-0 text-base font-extrabold">{isDoctor ? 'Your Consultation History' : 'Your Donation History'}</h2>
        <div className="mt-4 space-y-3">
          {items.map((item) => {
            const upcoming = item.status === 'Upcoming'
            return (
              <article key={item.id} className="relative rounded-xl bg-zinc-50 p-4 dark:bg-panel-2">
                <span className={`absolute top-4 right-4 text-xs font-bold ${
                  upcoming ? 'rounded-full bg-brand px-2.5 py-1 text-white' : 'text-slate-400'
                }`}
                >
                  {item.status}
                </span>
                <div className="flex items-start gap-3 pr-24">
                  <span className={`grid h-10 w-10 place-items-center rounded-full text-white ${upcoming ? 'bg-brand' : 'bg-emerald-500'}`}>
                    <Icon name={upcoming ? 'clock' : 'check'} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="m-0 text-base font-bold">{item.title}</h3>
                    <p className="mt-1 mb-0 text-sm text-slate-500">{item.date}</p>
                    <p className="mt-1 mb-0 flex items-center gap-1.5 text-sm text-slate-500">
                      <Icon name="pin" className="h-4 w-4" /> {item.location}
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
