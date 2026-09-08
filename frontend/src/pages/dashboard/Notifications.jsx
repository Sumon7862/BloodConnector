import { useEffect, useState } from 'react'
import DashPageHead from '../../components/DashPageHead.jsx'
import { Icon } from '../../components/DashIcons.jsx'
import { btnOutline, cardClass } from '../../lib/classes.js'
import { DEFAULT_NOTIFICATIONS } from '../../data/dashboardData.js'

const KEY = 'bloodconnector-notifications'

function loadNotes() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : DEFAULT_NOTIFICATIONS
  } catch {
    return DEFAULT_NOTIFICATIONS
  }
}

export default function Notifications() {
  const [notes, setNotes] = useState(() => loadNotes())

  useEffect(() => {
    document.title = 'BloodConnector — Notifications'
  }, [])

  function persist(next) {
    setNotes(next)
    localStorage.setItem(KEY, JSON.stringify(next))
  }

  return (
    <div>
      <DashPageHead
        title="Notifications"
        subtitle="Stay updated with your blood donation activities"
        action={
          <button
            type="button"
            className={`${btnOutline} h-10 px-4`}
            onClick={() => persist(notes.map((item) => ({ ...item, unread: false })))}
          >
            Mark All Read
          </button>
        }
      />
      <div className="space-y-3">
        {notes.map((item) => (
          <article
            key={item.id}
            className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center ${
              item.unread
                ? 'border-rose-100 bg-rose-50 dark:border-brand/30 dark:bg-brand/10'
                : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-panel'
            }`}
          >
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${
              item.tone === 'heart' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-brand'
            }`}
            >
              <Icon name={item.tone === 'heart' ? 'heart' : item.tone === 'clock' ? 'clock' : item.tone === 'bell' ? 'bell' : 'drop'} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="m-0 text-base font-extrabold">{item.title}</h2>
              <p className="mt-1 mb-0 text-sm text-slate-500 dark:text-slate-400">{item.message}</p>
              <p className="mt-1 mb-0 text-xs text-slate-400">{item.time}</p>
            </div>
            {item.unread ? (
              <span className="self-start rounded bg-brand px-2 py-1 text-[11px] font-bold text-white">New</span>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  )
}
