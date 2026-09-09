import { Link } from 'react-router-dom'

export default function BrandMark({ size = 'md', to = '/', className = '', inverse = false }) {
  const stacked = size === 'lg'
  const content = (
    <span className={`inline-flex min-w-0 items-center gap-1.5 sm:gap-2 ${stacked ? 'flex-col gap-3' : ''}`}>
      <img
        src="/logo.png"
        alt=""
        width={stacked ? 72 : 36}
        height={stacked ? 72 : 36}
        className={`shrink-0 object-contain ${stacked ? 'h-[72px] w-[72px]' : 'h-8 w-8 sm:h-9 sm:w-9'}`}
      />
      <span className={`font-extrabold tracking-tight ${stacked ? 'text-[clamp(26px,7vw,32px)]' : 'text-[15px] sm:text-lg'}`}>
        <span className="text-brand">Blood</span>
        <span className={inverse ? 'text-white' : 'text-navy dark:text-slate-300'}>Connector</span>
      </span>
    </span>
  )

  if (!to) return content
  return (
    <Link to={to} className={`inline-flex min-w-0 no-underline ${className}`} aria-label="BloodConnector home">
      {content}
    </Link>
  )
}
