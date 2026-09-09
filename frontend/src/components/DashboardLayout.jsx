import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Icon } from './DashIcons.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { openAdminApp } from '../lib/apps.js'

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const isAdmin = user?.role === 'admin'
  const links = [
    { to: '/dashboard', label: 'Overview', icon: 'home', end: true },
    { to: '/dashboard/profile', label: 'Profile', icon: 'user' },
    { to: '/dashboard/request-blood', label: 'Request Blood', icon: 'drop' },
    { to: '/dashboard/open-requests', label: 'Matching Requests', icon: 'alert' },
    { to: '/dashboard/people', label: 'Family & Donors', icon: 'people' },
    { to: '/dashboard/donations', label: 'My Donations', icon: 'heart' },
    { to: '/dashboard/notifications', label: 'Notifications', icon: 'bell' },
    { to: '/dashboard/settings', label: 'Settings', icon: 'gear' },
  ]

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (isAdmin) {
    if (!openAdminApp()) logout()
    return null
  }

  return (
    <div>
      {open ? (
        <button
          type="button"
          className="fixed top-16 right-0 bottom-0 left-0 z-30 bg-slate-900/40 sm:top-[72px] lg:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`${
          open ? 'translate-x-0' : '-translate-x-full'
        } fixed top-16 bottom-0 left-0 z-40 flex w-65 flex-col overflow-hidden border-r border-slate-200 bg-white transition-transform sm:top-[72px] lg:translate-x-0 dark:border-slate-700 dark:bg-panel`}
      >
        <p className="px-5 pt-5 pb-2 text-[11px] font-bold tracking-[0.18em] text-slate-400 uppercase">
          Donor desk
        </p>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 pb-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `inline-flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm no-underline transition ${
                  isActive
                    ? 'bg-rose-50 font-bold text-brand dark:bg-brand/15 dark:text-white'
                    : 'font-medium text-slate-500 hover:bg-rose-50 hover:text-brand dark:text-slate-400 dark:hover:bg-brand/15 dark:hover:text-white'
                }`
              }
            >
              <Icon name={link.icon} className="h-4.5 w-4.5" />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-3 dark:border-slate-700">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center rounded-xl bg-brand px-3 py-2.5 text-sm font-bold text-white hover:bg-brand-hover"
            onClick={() => {
              logout()
              navigate('/', { replace: true })
            }}
          >
            Log Out
          </button>
        </div>
      </aside>

      <div className="min-w-0 lg:ml-65">
        <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden dark:border-slate-700 dark:bg-panel">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 dark:border-slate-600"
            aria-label="Open dashboard menu"
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" />
          </button>
          <p className="m-0 text-sm font-bold">Dashboard menu</p>
        </div>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
