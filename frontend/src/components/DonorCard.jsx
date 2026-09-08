import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DonorAvatar from './DonorAvatar.jsx'
import { btnOutline, cardClass } from '../lib/classes.js'
import { useAuth } from '../context/AuthContext.jsx'
import { addKnownDonor, loadFriends, removeKnownDonor, toDirectoryPerson } from '../lib/people.js'
import { AvailabilityStatus } from './DonationCountdown.jsx'

export default function DonorCard({ donor }) {
  const { user, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const person = useMemo(() => toDirectoryPerson(donor), [donor])
  const [added, setAdded] = useState(() => (user ? loadFriends(user).some((item) => item.id === person.id) : false))

  function handleAdd() {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    if (added) {
      setAdded(false)
      removeKnownDonor(user, person.id)
      return
    }
    addKnownDonor(user, person)
    setAdded(true)
  }

  return (
    <article className={`${cardClass} p-4 sm:p-5`}>
      <div className="flex items-start gap-3">
        <DonorAvatar name={donor.name} photo={donor.photo} />
        <div className="min-w-0 flex-1">
          <h3 className="m-0 truncate text-base font-bold">{donor.name}</h3>
          <p className="mt-1 truncate text-[13px] text-slate-500 dark:text-slate-400">{donor.location}</p>
        </div>
        <span className="shrink-0 rounded-md bg-brand px-2 py-1 text-[13px] font-extrabold text-white">
          {donor.bloodType}
        </span>
      </div>

      <div className="mt-4 mb-4">
        <AvailabilityStatus until={person.nextEligibleAt} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <a href={`tel:${donor.phone}`} className={`${btnOutline} w-full gap-1.5 border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200`}>
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
            <path d="M6.5 4h3l1.2 3.2-1.8 1.8a12 12 0 0 0 6.1 6.1l1.8-1.8 3.2 1.2v3A2.5 2.5 0 0 1 17.5 20 15.5 15.5 0 0 1 4 6.5 2.5 2.5 0 0 1 6.5 4Z" />
          </svg>
          Contact
        </a>
        <Link to={`/donors/${donor.id}`} className={`${btnOutline} w-full`}>
          Donor History
        </Link>
      </div>
      <button
        type="button"
        className={`mt-2 inline-flex h-10 w-full items-center justify-center rounded-lg text-sm font-bold ${
          added
            ? 'border border-brand bg-rose-50 text-brand dark:bg-brand/15'
            : 'bg-brand text-white hover:bg-brand-hover'
        }`}
        onClick={handleAdd}
      >
        {isLoggedIn ? (added ? 'Added · Remove' : 'Add donor') : 'Login to add'}
      </button>
    </article>
  )
}
