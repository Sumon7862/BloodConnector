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
  const ready = parts.done
  const mode = variant || (compact ? 'compact' : 'full')
  const days = ready ? 0 : parts.days
  const hours = ready ? '00' : padTime(parts.hours)
  const minutes = ready ? '00' : padTime(parts.minutes)
  const seconds = ready ? '00' : padTime(parts.seconds)
  const boxes = [
    [days, 'Days'],
    [hours, 'Hours'],
    [minutes, 'Mins'],
    [seconds, 'Secs'],
  ]

  if (mode === 'compact') {
    return (
      <p className={`mt-2 mb-0 text-xs font-semibold ${ready ? 'text-emerald-600 dark:text-emerald-400' : 'text-brand'}`}>
        {ready
          ? `Available now ${days}d ${hours}:${minutes}:${seconds}`
          : `Available in ${days}d ${hours}:${minutes}:${seconds}`}
      </p>
    )
  }

  return (
    <div
      className={`w-full overflow-hidden rounded-xl border p-3 ${
        ready
          ? 'border-emerald-200 bg-linear-to-b from-emerald-50 to-white dark:border-emerald-500/30 dark:from-emerald-400/10 dark:to-panel-2'
          : 'border-rose-200 bg-linear-to-b from-rose-50 to-white dark:border-brand/40 dark:from-brand/20 dark:to-panel-2'
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className={`m-0 text-xs font-extrabold tracking-wide uppercase ${ready ? 'text-emerald-700 dark:text-emerald-300' : 'text-brand'}`}>
          {ready ? 'Available now' : label}
        </p>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold text-white ${ready ? 'bg-emerald-600' : 'bg-brand'}`}>
          {ready ? 'Available' : 'Waiting'}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {boxes.map(([value, name]) => (
          <div
            key={name}
            className={`rounded-lg bg-white px-1 py-2 text-center shadow-sm ring-1 dark:bg-ink ${
              ready ? 'ring-emerald-100 dark:ring-emerald-500/30' : 'ring-rose-100 dark:ring-brand/30'
            }`}
          >
            <p className={`m-0 text-lg font-extrabold tabular-nums sm:text-2xl ${ready ? 'text-emerald-600 dark:text-emerald-400' : 'text-brand'}`}>
              {value}
            </p>
            <p className="mt-0.5 mb-0 text-[10px] font-bold tracking-wide text-slate-500 uppercase">{name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AvailabilityStatus({ until }) {
  const eligible = isDonationEligible(until)
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm text-slate-500">Status</span>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${
            eligible
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300'
          }`}
        >
          {eligible ? 'Available' : 'Not available'}
        </span>
      </div>
      <DonationCountdown until={until} />
    </div>
  )
}
