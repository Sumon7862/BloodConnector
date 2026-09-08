import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import BrandMark from './BrandMark.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getInitials } from '../lib/user.js'

const PRIMARY_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About', end: true },
  { to: '/donors', label: 'Donors' },
  { to: '/doctors', label: 'Free Doctor Service' },
  { to: '/gallery', label: 'Gallery' },
]

function navClass(active) {
  return `inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-semibold no-underline transition ${
    active
      ? 'bg-rose-50 text-brand dark:bg-brand/15'
      : 'text-slate-800 hover:bg-rose-50 hover:text-brand dark:text-slate-100 dark:hover:bg-brand/15'
  }`
}

export default function Navbar() {
  const { user, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  function AuthButtons() {
    if (isLoggedIn) return null
    const loginClass = `inline-flex h-10 w-full items-center justify-center rounded-lg border px-3.5 text-sm font-bold no-underline xl:h-[38px] xl:w-auto ${
      pathname === '/login'
        ? 'border-brand bg-rose-50 text-brand dark:bg-brand/15'
        : 'border-slate-300 text-slate-800 hover:border-brand hover:text-brand dark:border-slate-600 dark:text-slate-100'
    }`
    const createClass = `inline-flex h-10 w-full items-center justify-center rounded-lg px-4 text-sm font-bold no-underline xl:h-[38px] xl:w-auto ${
      pathname === '/signup'
        ? 'bg-brand-hover text-white ring-2 ring-brand/30'
        : 'bg-brand text-white shadow-[0_6px_14px_rgba(225,29,45,0.28)] hover:bg-brand-hover'
    }`
    return (
      <div className="flex w-full flex-col gap-2 sm:flex-row xl:w-auto">
        <Link to="/login" className={loginClass} onClick={() => setMenuOpen(false)}>
          Login
        </Link>
        <Link to="/signup" className={createClass} onClick={() => setMenuOpen(false)}>
          Create Account
        </Link>
      </div>
    )
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-panel">
      <div className="relative mx-auto flex min-h-16 w-[min(1180px,calc(100%-24px))] items-center gap-2 sm:min-h-[72px] sm:w-[min(1180px,calc(100%-32px))] sm:gap-4">
        <BrandMark className="min-w-0 shrink" />

        <nav
          className={`${
            menuOpen ? 'flex' : 'hidden'
          } absolute top-full right-0 left-0 z-40 max-h-[calc(100svh-4rem)] flex-col items-stretch gap-1 overflow-y-auto border-b border-slate-200 bg-white p-4 shadow-lg xl:static xl:z-auto xl:flex xl:max-h-none xl:flex-1 xl:flex-row xl:items-center xl:justify-center xl:gap-1 xl:overflow-visible xl:border-0 xl:bg-transparent xl:p-0 xl:shadow-none dark:border-slate-700 dark:bg-panel`}
        >
          {PRIMARY_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.end}
              className={({ isActive }) => navClass(isActive)}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          <div className="mt-3 border-t border-slate-200 pt-3 pb-[env(safe-area-inset-bottom)] xl:hidden dark:border-slate-700">
            <AuthButtons />
          </div>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5">
          <ThemeToggle />
          {isLoggedIn ? (
            <button
              type="button"
              className="h-9 w-9 overflow-hidden rounded-full border-2 border-rose-100 bg-brand text-sm font-extrabold text-white shadow-[0_0_0_2px_#e11d2d] sm:h-10 sm:w-10 dark:border-brand/30"
              aria-label="Open your dashboard"
              onClick={() => navigate('/dashboard')}
            >
              {user?.photo ? (
                <img src={user.photo} alt="" className="h-full w-full object-cover" />
              ) : (
                getInitials(user?.name)
              )}
            </button>
          ) : (
            <div className="hidden xl:block">
              <AuthButtons />
            </div>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white xl:hidden dark:border-slate-600 dark:bg-panel"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="block h-0.5 w-5 bg-slate-800 dark:bg-slate-100" />
          <span className="block h-0.5 w-5 bg-slate-800 dark:bg-slate-100" />
          <span className="block h-0.5 w-5 bg-slate-800 dark:bg-slate-100" />
        </button>
      </div>
    </header>
  )
}
