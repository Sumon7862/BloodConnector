import { useTheme } from '../context/ThemeContext.jsx'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="border-0 bg-transparent p-0"
    >
      <span className="relative grid h-[34px] w-16 grid-cols-2 items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-600 dark:bg-panel">
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-brand transition-transform ${
            isDark ? 'translate-x-[30px]' : 'translate-x-0'
          }`}
        />
        <svg
          className={`z-10 h-4 w-4 justify-self-center ${isDark ? 'text-slate-400' : 'text-white'}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v1.5M12 19.5V21M4.93 4.93l1.06 1.06M18.01 18.01l1.06 1.06M3 12h1.5M19.5 12H21M4.93 19.07l1.06-1.06M18.01 5.99l1.06-1.06" />
        </svg>
        <svg
          className={`z-10 h-4 w-4 justify-self-center ${isDark ? 'text-white' : 'text-slate-400'}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M15.5 3.5A8.5 8.5 0 1 0 20.5 14 7 7 0 0 1 15.5 3.5Z" />
        </svg>
      </span>
    </button>
  )
}
