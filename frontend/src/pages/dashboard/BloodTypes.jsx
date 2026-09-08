import { useEffect } from 'react'
import DashPageHead from '../../components/DashPageHead.jsx'
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
            <span className="inline-flex min-w-16 items-center justify-center rounded-full bg-brand px-4 py-1.5 text-sm font-extrabold text-white">
              {item.type}
            </span>
            <p className="mt-5 mb-1 text-xs font-semibold tracking-wide text-slate-400 uppercase">Can Donate To</p>
            <p className="m-0 text-sm font-bold text-brand">{item.donate}</p>
            <p className="mt-4 mb-1 text-xs font-semibold tracking-wide text-slate-400 uppercase">Can Receive From</p>
            <p className="m-0 text-sm font-bold text-brand">{item.receive}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
