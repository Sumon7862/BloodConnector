import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Icon } from '../components/DashIcons.jsx'
import BrandMark from '../components/BrandMark.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getInitials } from '../lib/user.js'
import { PUBLIC_APP_URL } from '../lib/apps.js'

const LINKS = [
  { to: '/', label: 'Overview', icon: 'home', end: true },
  { to: '/users', label: 'Users', icon: 'user' },
  { to: '/requests', label: 'Requests', icon: 'alert' },
  { to: '/donors', label: 'Donors', icon: 'people' },
  { to: '/doctors', label: 'Doctors', icon: 'consult' },
  { to: '/banks', label: 'Blood banks', icon: 'drop' },
  { to: '/opinions', label: 'Opinions', icon: 'heart' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="min-h-svh bg-zinc-50 text-slate-900 dark:bg-ink dark:text-slate-100">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-700 dark:bg-panel/95">
        <div className="mx-auto flex min-h-16 w-[min(1180px,calc(100%-24px))] items-center gap-3 sm:min-h-[72px]">
          <BrandMark />
          <p className="hidden text-xs font-bold tracking-[0.18em] text-slate-400 uppercase sm:block">Admin</p>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <span className="hidden items-center gap-2 sm:inline-flex">
              <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-brand text-xs font-extrabold text-white">
                {user?.photo ? <img src={user.photo} alt="" className="h-full w-full object-cover" /> : getInitials(user?.name)}
              </span>
              <span className="text-sm font-bold">{user?.name}</span>
            </span>
          </div>
        </div>
      </header>
      <div className="h-16 sm:h-[72px]" aria-hidden="true" />

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
        <p className="px-5 pt-5 pb-2 text-[11px] font-bold tracking-[0.18em] text-slate-400 uppercase">Admin desk</p>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 pb-4">
          {LINKS.map((link) => (
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
        <div className="space-y-2 border-t border-slate-200 p-3 dark:border-slate-700">
          {PUBLIC_APP_URL ? (
            <a
              href={PUBLIC_APP_URL}
              className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-slate-300 text-sm font-bold text-slate-700 no-underline hover:border-brand hover:text-brand dark:border-slate-600 dark:text-slate-200"
            >
              Public site
            </a>
          ) : null}
          <button
            type="button"
            className="inline-flex w-full items-center justify-center rounded-xl bg-brand px-3 py-2.5 text-sm font-bold text-white hover:bg-brand-hover"
            onClick={() => {
              logout()
              navigate('/login', { replace: true })
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
            aria-label="Open admin menu"
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" />
          </button>
          <p className="m-0 text-sm font-bold">Admin menu</p>
        </div>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
