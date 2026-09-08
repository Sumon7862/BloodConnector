import { useEffect } from 'react'
import DashPageHead from '../../components/DashPageHead.jsx'
import DonationCountdown from '../../components/DonationCountdown.jsx'
import { btnOutline, cardClass } from '../../lib/classes.js'
import { DONATION_WAIT_DAYS, markDonatedNow } from '../../lib/eligibility.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function MyDonations() {
  const { user, updateUser } = useAuth()
  const isDoctor = user.role === 'doctor'

  useEffect(() => {
    document.title = isDoctor ? 'BloodConnector — My Consultations' : 'BloodConnector — My Donations'
  }, [isDoctor])

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
        <p className="mt-4 mb-0 text-sm text-slate-500">
          {isDoctor
            ? 'No consultations recorded yet.'
            : 'No donations recorded yet. Tap “I donated today” after you give blood.'}
        </p>
      </section>
    </div>
  )
}
