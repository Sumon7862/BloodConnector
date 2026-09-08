import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashPageHead from '../../components/DashPageHead.jsx'
import DonationCountdown from '../../components/DonationCountdown.jsx'
import { Icon } from '../../components/DashIcons.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { roleLabel } from '../../lib/user.js'
import { btnOutline, cardClass } from '../../lib/classes.js'
import { DONATION_WAIT_DAYS, isDonationEligible, markDonatedNow } from '../../lib/eligibility.js'
import {
  RECENT_ACTIVITY,
  UPCOMING_EVENTS,
  URGENT_REQUESTS,
} from '../../data/dashboardData.js'

export default function DashboardHome() {
  const { user, updateUser } = useAuth()
  const isDoctor = user.role === 'doctor'
  const firstName = String(user.name || 'there').split(' ')[0]
  const eligible = isDonationEligible(user.nextEligibleAt)

  useEffect(() => {
    document.title = 'BloodConnector — Dashboard'
  }, [])

  const metrics = isDoctor
    ? [
        ['Total Consultations', user.consultations || 48, 'consult', '+ 6 this month'],
        ['Patients Assisted', 36, 'user', '3 per week'],
        ['Average Rating', '4.8', 'star', 'From gallery reviews'],
        ['Experience', `${user.experience || 5} yrs`, 'clock', 'Certified doctor'],
      ]
    : [
        ['Total Donations', user.donationCount || 12, 'heart', '+ 2 this year'],
        ['Lives Saved', 36, 'user', '3 per donation'],
        ['Upcoming', 2, 'calendar', 'Next in October'],
        ['Next eligible', eligible ? 'Now' : 'Wait', 'clock', eligible ? 'Ready to donate' : 'Countdown below'],
      ]

  return (
    <div>
      <DashPageHead
        title={`Welcome Back, ${firstName}!`}
        subtitle="Here's what's happening with your blood donation activities."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, icon, note]) => (
          <article key={label} className={`${cardClass} p-4`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="m-0 text-sm text-slate-500">{label}</p>
                <p className="mt-1 mb-0 text-3xl font-extrabold">{value}</p>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand text-white">
                <Icon name={icon} className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 mb-0 text-xs font-semibold text-emerald-600 dark:text-emerald-400">{note}</p>
          </article>
        ))}
      </div>

      {!isDoctor ? (
        <section className={`${cardClass} mt-5 p-5 sm:p-6`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="m-0 text-lg font-extrabold">Next donation availability</h2>
              <p className="mt-1 mb-0 text-sm text-slate-500">
                Whole blood donors wait {DONATION_WAIT_DAYS} days before the next donation.
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

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <section className={`${cardClass} p-5`}>
          <div className="mb-4 flex items-center gap-2">
            <h2 className="m-0 text-lg font-extrabold">Urgent Blood Requests</h2>
            <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white">Live</span>
          </div>
          <div className="space-y-3">
            {URGENT_REQUESTS.map((item) => (
              <article key={item.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center dark:border-slate-700">
                <strong className="text-xl text-brand">{item.type}</strong>
                <p className="m-0 flex flex-1 items-center gap-1.5 text-sm text-slate-500">
                  <Icon name="pin" className="h-4 w-4" /> {item.location}
                </p>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                  item.level === 'Critical' ? 'bg-rose-100 text-brand' : 'bg-amber-100 text-amber-700'
                }`}
                >
                  {item.level}
                </span>
                <Link to="/dashboard/request-blood" className="inline-flex h-10 items-center justify-center rounded-lg bg-brand px-4 text-sm font-bold text-white no-underline hover:bg-brand-hover">
                  Respond Now
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className={`${cardClass} p-5`}>
          <h2 className="m-0 text-lg font-extrabold">Upcoming Donations</h2>
          <div className="mt-4 space-y-3">
            {UPCOMING_EVENTS.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="m-0 text-sm font-bold">{item.name}</h3>
                    <p className="mt-1 mb-0 text-xs text-slate-500">{item.date}</p>
                    <p className="mt-1 mb-0 flex items-center gap-1 text-xs text-slate-500">
                      <Icon name="pin" className="h-3.5 w-3.5" /> {item.location}
                    </p>
                  </div>
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-rose-50 text-brand dark:bg-brand/15">
                    <Icon name="calendar" className="h-4 w-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>
          <Link to="/dashboard/donations" className={`${btnOutline} mt-4 h-10 w-full no-underline`}>
            View All {isDoctor ? 'Appointments' : 'Donations'}
          </Link>
        </section>
      </div>

      <section className={`${cardClass} mt-5 p-5`}>
        <h2 className="m-0 text-lg font-extrabold">Recent Activity</h2>
        <ul className="mt-4 mb-0 list-none space-y-3 p-0">
          {RECENT_ACTIVITY.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-full bg-rose-50 text-brand dark:bg-brand/15">
                <Icon name="heart" className="h-4 w-4" />
              </span>
              <div>
                <p className="m-0 text-sm font-semibold">{item.text}</p>
                <p className="mt-0.5 mb-0 text-xs text-slate-400">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-5 rounded-[14px] bg-[linear-gradient(90deg,#e11d2d,#fb7185)] p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Link to="/donors" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white font-bold text-brand no-underline">
            <Icon name="search" className="h-4 w-4" /> Find Donors
          </Link>
          <Link to="/dashboard/request-blood" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white font-bold text-brand no-underline">
            <Icon name="drop" className="h-4 w-4" /> Request Blood
          </Link>
          <Link to="/dashboard/consultation" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white font-bold text-brand no-underline">
            <Icon name="consult" className="h-4 w-4" /> Consult Doctor
          </Link>
        </div>
        <p className="mt-3 mb-0 text-center text-xs text-white/85">Signed in as {roleLabel(user.role)}</p>
      </section>
    </div>
  )
}
