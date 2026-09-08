import { USER_ROLES } from '../utils/validation.js'

export default function RoleSelect({ id, value, onChange, error }) {
  return (
    <div id={id} className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Account role">
      {USER_ROLES.map((role) => {
        const selected = value === role.value
        return (
          <button
            key={role.value}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`h-11 rounded-lg border text-sm font-bold transition ${
              selected
                ? 'border-brand bg-rose-50 text-brand dark:bg-brand/15'
                : `border-slate-300 text-slate-700 hover:border-brand/50 dark:border-slate-600 dark:text-slate-200 ${error ? 'border-brand' : ''}`
            }`}
            onClick={() => onChange(role.value)}
          >
            {role.label}
          </button>
        )
      })}
    </div>
  )
}
