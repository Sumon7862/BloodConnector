import { Icon } from './DashIcons.jsx'
import { dashInput } from '../lib/classes.js'

export default function IconField({ id, label, icon, required, error, children }) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1.5 block text-sm font-semibold">
        {label}
        {required ? <span className="text-brand"> *</span> : null}
      </span>
      {children || null}
      {error ? (
        <p className="mt-1.5 mb-0 text-xs font-medium text-brand" role="alert">
          {error}
        </p>
      ) : null}
    </label>
  )
}

export function IconInput({ id, icon, className = '', ...props }) {
  return (
    <span className="relative block">
      {icon ? (
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
          <Icon name={icon} className="h-4 w-4" />
        </span>
      ) : null}
      <input id={id} className={`${dashInput} ${icon ? 'pl-10' : ''} ${className}`} {...props} />
    </span>
  )
}

export function IconSelect({ id, icon, className = '', children, ...props }) {
  return (
    <span className="relative block">
      {icon ? (
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
          <Icon name={icon} className="h-4 w-4" />
        </span>
      ) : null}
      <select id={id} className={`${dashInput} ${icon ? 'pl-10' : ''} ${className}`} {...props}>
        {children}
      </select>
    </span>
  )
}
