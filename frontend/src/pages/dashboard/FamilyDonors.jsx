import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashPageHead from '../../components/DashPageHead.jsx'
import DonorAvatar from '../../components/DonorAvatar.jsx'
import { Icon } from '../../components/DashIcons.jsx'
import { IconInput, IconSelect } from '../../components/IconField.jsx'
import { btnOutline, cardClass } from '../../lib/classes.js'
import { BLOOD_GROUPS } from '../../utils/validation.js'
import { SEED_FAMILY } from '../../data/dashboardData.js'
import { loadFamily, loadFriends, removeKnownDonor, saveFamily } from '../../lib/people.js'
import { parseEligibleAt } from '../../lib/eligibility.js'
import { AvailabilityStatus } from '../../components/DonationCountdown.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const EMPTY_MEMBER = {
  name: '',
  bloodType: 'O+',
  relation: '',
  email: '',
  phone: '',
}

export default function FamilyDonors() {
  const { user } = useAuth()
  const [friends, setFriends] = useState(() => loadFriends(user))
  const [family, setFamily] = useState(() => loadFamily(user, SEED_FAMILY))
  const [adding, setAdding] = useState(false)
  const [member, setMember] = useState(EMPTY_MEMBER)

  useEffect(() => {
    document.title = 'BloodConnector — Family & Donors'
  }, [])

  function persistFamily(next) {
    setFamily(next)
    saveFamily(user, next)
  }

  function addMember(event) {
    event.preventDefault()
    if (!member.name.trim() || !member.relation.trim()) return
    persistFamily([
      {
        id: crypto.randomUUID(),
        ...member,
        name: member.name.trim(),
        eligible: 'Available now',
        nextEligibleAt: new Date().toISOString(),
        available: true,
      },
      ...family,
    ])
    setMember(EMPTY_MEMBER)
    setAdding(false)
  }

  return (
    <div>
      <DashPageHead
        title="Family & Donors"
        subtitle="Your saved known donors and family members live here."
      />

      <section className={`${cardClass} p-5 sm:p-6`}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="m-0 flex items-center gap-2 text-lg font-extrabold">
              <Icon name="people" className="h-5 w-5 text-brand" /> Known donors
            </h2>
            <p className="mt-1 mb-0 text-sm text-slate-500">
              Add people you know from the Donors page. They will show up in this list.
            </p>
          </div>
          <Link to="/donors" className={`${btnOutline} h-10 no-underline`}>
            Find donors
          </Link>
        </div>
        {friends.length === 0 ? (
          <p className="m-0 rounded-xl bg-zinc-50 px-4 py-6 text-sm text-slate-500 dark:bg-panel-2">
            No known donors saved yet. Open Donors, find someone you know, and tap Add donor.
          </p>
        ) : (
          <div className="space-y-3">
            {friends.map((person) => (
              <article key={person.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center dark:border-slate-700">
                <DonorAvatar name={person.name} photo={person.photo} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="m-0 text-base font-extrabold">{person.name}</h3>
                    {person.bloodType ? (
                      <span className="rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-white">{person.bloodType}</span>
                    ) : null}
                    <span className="text-sm text-slate-500">{person.role}</span>
                  </div>
                  <p className="mt-1 mb-0 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                    {person.phone ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="phone" className="h-4 w-4" /> {person.phone}
                      </span>
                    ) : null}
                    {person.location ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="pin" className="h-4 w-4" /> {person.location}
                      </span>
                    ) : null}
                  </p>
                  <AvailabilityStatus until={person.nextEligibleAt} />
                </div>
                <div className="flex items-center gap-2">
                  {person.donorId ? (
                    <Link to={`/donors/${person.donorId}`} className={`${btnOutline} h-9 no-underline`}>
                      View
                    </Link>
                  ) : person.phone ? (
                    <a href={`tel:${person.phone}`} className={`${btnOutline} h-9 no-underline`}>
                      Call
                    </a>
                  ) : null}
                  <button
                    type="button"
                    className="text-slate-400 hover:text-brand"
                    aria-label={`Remove ${person.name}`}
                    onClick={() => setFriends(removeKnownDonor(user, person.id))}
                  >
                    <Icon name="trash" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className={`${cardClass} mt-5 p-5 sm:p-6`}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="m-0 flex items-center gap-2 text-lg font-extrabold">
              <Icon name="people" className="h-5 w-5 text-brand" /> Family members
            </h2>
            <p className="mt-1 mb-0 text-sm text-slate-500">
              Manage your family members&apos; blood donation information.
            </p>
          </div>
          <button type="button" className={btnOutline} onClick={() => setAdding((open) => !open)}>
            + Add Family Member
          </button>
        </div>

        {adding ? (
          <form className="mb-4 grid gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-2 dark:border-slate-700" onSubmit={addMember}>
            <IconInput placeholder="Full name" value={member.name} onChange={(event) => setMember({ ...member, name: event.target.value })} />
            <IconInput placeholder="Relationship" value={member.relation} onChange={(event) => setMember({ ...member, relation: event.target.value })} />
            <IconSelect value={member.bloodType} onChange={(event) => setMember({ ...member, bloodType: event.target.value })}>
              {BLOOD_GROUPS.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </IconSelect>
            <IconInput placeholder="Phone" value={member.phone} onChange={(event) => setMember({ ...member, phone: event.target.value })} />
            <div className="sm:col-span-2">
              <IconInput placeholder="Email" value={member.email} onChange={(event) => setMember({ ...member, email: event.target.value })} />
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <button type="submit" className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-sm font-bold text-white">
                Save member
              </button>
              <button type="button" className="h-10 px-3 text-sm font-bold text-slate-500" onClick={() => setAdding(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        {family.length === 0 ? (
          <p className="m-0 text-sm text-slate-500">No family members added yet.</p>
        ) : (
          <div className="space-y-3">
            {family.map((item) => (
              <article key={item.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center dark:border-slate-700">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="m-0 text-base font-extrabold">{item.name}</h3>
                    <span className="rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-white">{item.bloodType}</span>
                    <span className="text-sm text-slate-500">{item.relation}</span>
                  </div>
                  <p className="mt-2 mb-0 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                    {item.email ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="mail" className="h-4 w-4" /> {item.email}
                      </span>
                    ) : null}
                    {item.phone ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="phone" className="h-4 w-4" /> {item.phone}
                      </span>
                    ) : null}
                  </p>
                  <AvailabilityStatus until={item.nextEligibleAt || parseEligibleAt(item.eligible)} />
                </div>
                <div className="flex items-center gap-3">
                  {item.available ? (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">Available</span>
                  ) : null}
                  <button
                    type="button"
                    className="text-slate-400 hover:text-brand"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => persistFamily(family.filter((row) => row.id !== item.id))}
                  >
                    <Icon name="trash" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
