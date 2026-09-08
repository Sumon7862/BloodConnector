import { useEffect, useState } from 'react'
import { isDonationEligible, padTime, remainingParts } from '../lib/eligibility.js'

export default function DonationCountdown({
  until,
  compact = false,
  variant = '',
  label = 'Available again in',
}) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const parts = remainingParts(until, now)
  const mode = variant || (compact ? 'compact' : 'full')
  const boxes = [
    [parts.days, 'Days'],
    [padTime(parts.hours), 'Hours'],
    [padTime(parts.minutes), 'Mins'],
    [padTime(parts.seconds), 'Secs'],
  ]

  if (parts.done) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 dark:border-emerald-500/30 dark:bg-emerald-400/10">
        <p className="m-0 text-sm font-extrabold text-emerald-700 dark:text-emerald-300">Available</p>
        <p className="m-0 text-xs font-semibold text-emerald-600 dark:text-emerald-400">Ready to donate now</p>
      </div>
    )
  }

  if (mode === 'compact') {
    return (
      <p className="mt-2 mb-0 text-xs font-semibold text-brand">
        Available in {parts.days}d {padTime(parts.hours)}:{padTime(parts.minutes)}:{padTime(parts.seconds)}
      </p>
    )
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-rose-200 bg-linear-to-b from-rose-50 to-white p-3 dark:border-brand/40 dark:from-brand/20 dark:to-panel-2">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="m-0 text-xs font-extrabold tracking-wide text-brand uppercase">{label}</p>
        <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white">Waiting</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {boxes.map(([value, name]) => (
          <div key={name} className="rounded-lg bg-white px-1 py-2 text-center shadow-sm ring-1 ring-rose-100 dark:bg-ink dark:ring-brand/30">
            <p className="m-0 text-lg font-extrabold tabular-nums text-brand sm:text-2xl">{value}</p>
            <p className="mt-0.5 mb-0 text-[10px] font-bold tracking-wide text-slate-500 uppercase">{name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AvailabilityStatus({ until }) {
  const eligible = isDonationEligible(until)
  if (eligible) {
    return (
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-slate-500">Status</span>
        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-extrabold text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
          Available
        </span>
      </div>
    )
  }
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm text-slate-500">Status</span>
        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-extrabold text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">
          Not available
        </span>
      </div>
      <DonationCountdown until={until} />
    </div>
  )
}
