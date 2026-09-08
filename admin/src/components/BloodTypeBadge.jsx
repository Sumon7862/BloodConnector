const sizes = {
  sm: 'rounded-md px-2 py-0.5 text-[11px]',
  md: 'rounded-md px-2 py-1 text-[13px]',
  lg: 'rounded-md px-3 py-1.5 text-base',
}

const tones = {
  brand:
    'border border-rose-200 bg-rose-50 text-brand dark:border-brand/35 dark:bg-brand/15 dark:text-rose-100',
  inverse: 'border border-white/40 bg-white text-brand',
}

const BLOOD_TYPE_RE = /(AB[+-]|[ABO][+-])/g
const BLOOD_TYPE_TOKEN = /^(AB[+-]|[ABO][+-])$/

export default function BloodTypeBadge({ type, size = 'md', tone = 'brand', className = '' }) {
  if (!type) return null
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center font-bold tracking-wide ${tones[tone] || tones.brand} ${sizes[size] || sizes.md} ${className}`}
    >
      {type}
    </span>
  )
}

export function HighlightBloodTypes({ text, size = 'sm', className = '' }) {
  const value = String(text || '')
  const parts = value.split(BLOOD_TYPE_RE)
  if (parts.length === 1) return value
  return (
    <span className={className}>
      {parts.map((part, index) =>
        BLOOD_TYPE_TOKEN.test(part) ? (
          <BloodTypeBadge key={`${part}-${index}`} type={part} size={size} className="mx-0.5 align-middle" />
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        )
      )}
    </span>
  )
}

export function BloodTypePills({ types, size = 'sm', className = '' }) {
  const list = String(types || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
  if (!list.length) return null
  return (
    <span className={`inline-flex flex-wrap items-center justify-center gap-1 ${className}`}>
      {list.map((type) => (
        <BloodTypeBadge key={type} type={type} size={size} />
      ))}
    </span>
  )
}
