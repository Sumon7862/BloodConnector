import { useEffect } from 'react'
import DashPageHead from '../../components/DashPageHead.jsx'
import BloodTypeBadge, { BloodTypePills } from '../../components/BloodTypeBadge.jsx'
import { cardClass } from '../../lib/classes.js'
import { BLOOD_COMPAT } from '../../data/dashboardData.js'

export default function BloodTypes() {
  useEffect(() => {
    document.title = 'BloodConnector — Blood Types'
  }, [])

  return (
    <div>
      <DashPageHead
        title="Blood Type Information"
        subtitle="Learn about blood type compatibility and donation guidelines"
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {BLOOD_COMPAT.map((item) => (
          <article key={item.type} className={`${cardClass} px-5 py-6 text-center`}>
            <BloodTypeBadge type={item.type} size="lg" />
            <p className="mt-5 mb-1 text-xs font-semibold tracking-wide text-slate-400 uppercase">Can Donate To</p>
            <BloodTypePills types={item.donate} className="justify-center" />
            <p className="mt-4 mb-1 text-xs font-semibold tracking-wide text-slate-400 uppercase">Can Receive From</p>
            <BloodTypePills types={item.receive} className="justify-center" />
          </article>
        ))}
      </div>
    </div>
  )
}
