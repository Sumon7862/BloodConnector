import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashPageHead from '../../components/DashPageHead.jsx'
import { Icon } from '../../components/DashIcons.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { btnOutline, cardClass } from '../../lib/classes.js'
import { loadNotifications, saveNotifications } from '../../lib/notifications.js'
import { HighlightBloodTypes } from '../../components/BloodTypeBadge.jsx'

export default function Notifications() {
  const { user } = useAuth()
  const [notes, setNotes] = useState(() => loadNotifications(user?.emailOrPhone))

  useEffect(() => {
    document.title = 'BloodConnector — Notifications'
  }, [])

  useEffect(() => {
    setNotes(loadNotifications(user?.emailOrPhone))
  }, [user?.emailOrPhone])

  function persist(next) {
    setNotes(next)
    saveNotifications(user.emailOrPhone, next)
  }

  return (
    <div>
      <DashPageHead
        title="Notifications"
        subtitle="Stay updated with requests, offers, and donation activity"
        action={
          notes.length ? (
            <button
              type="button"
              className={`${btnOutline} h-10 px-4`}
              onClick={() => persist(notes.map((item) => ({ ...item, unread: false })))}
            >
              Mark All Read
            </button>
          ) : null
        }
      />
      <div className="space-y-3">
        {notes.length ? notes.map((item) => (
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
              <h2 className="m-0 text-base font-extrabold">
                <HighlightBloodTypes text={item.title} />
              </h2>
              <p className="mt-1 mb-0 text-sm text-slate-500 dark:text-slate-400">
                <HighlightBloodTypes text={item.message} />
              </p>
              <p className="mt-1 mb-0 text-xs text-slate-400">{item.time}</p>
            </div>
            <div className="flex items-center gap-2">
              {item.to ? (
                <Link to={item.to} className={`${btnOutline} h-9 px-3 no-underline`}>
                  Open
                </Link>
              ) : null}
              {item.unread ? (
                <span className="self-start rounded bg-brand px-2 py-1 text-[11px] font-bold text-white">New</span>
              ) : null}
            </div>
          </article>
        )) : (
          <p className={`${cardClass} px-5 py-10 text-center text-slate-500`}>No notifications yet.</p>
        )}
      </div>
    </div>
  )
}
