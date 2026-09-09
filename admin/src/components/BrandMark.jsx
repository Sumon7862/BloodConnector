import { Link } from 'react-router-dom'

export default function BrandMark({ to = '/', className = '' }) {
  const content = (
    <span className="inline-flex min-w-0 items-center gap-1.5 sm:gap-2">
      <img src="/logo.png" alt="" width="36" height="36" className="h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9" />
      <span className="text-[15px] font-extrabold tracking-tight sm:text-lg">
        <span className="text-brand">Blood</span>
        <span className="text-navy dark:text-slate-300">Connector</span>
      </span>
    </span>
  )
  if (!to) return content
  return (
    <Link to={to} className={`inline-flex min-w-0 no-underline ${className}`} aria-label="BloodConnector admin">
      {content}
    </Link>
  )
}
