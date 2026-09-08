import { useId, useState } from 'react'
import { inputClass } from '../lib/classes.js'

export default function PasswordInput({
  id,
  value,
  onChange,
  onBlur,
  autoComplete,
  placeholder = '••••••••',
  invalid = false,
}) {
  const [visible, setVisible] = useState(false)
  const fallbackId = useId()
  const inputId = id || fallbackId

  return (
    <div className="relative">
      <input
        id={inputId}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        placeholder={placeholder}
        spellCheck="false"
        className={`${inputClass} pr-11 ${invalid ? 'border-brand' : ''}`}
      />
      <button
        type="button"
        className="absolute top-1/2 right-2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md border-0 bg-transparent text-slate-500 hover:bg-rose-50 hover:text-slate-800 dark:hover:bg-brand/15"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? (
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.8]" aria-hidden="true">
            <path d="M3 3l18 18" />
            <path d="M10.6 10.7a2 2 0 0 0 2.8 2.8" />
            <path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c5 0 9.3 3.1 11 7.5a12.3 12.3 0 0 1-4.2 5.1" />
            <path d="M6.1 6.6A12.4 12.4 0 0 0 1 12.5C2.7 16.9 7 20 12 20c1.6 0 3.1-.3 4.5-.9" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.8]" aria-hidden="true">
            <path d="M2 12.5C3.7 8.1 8 5 13 5s9.3 3.1 11 7.5C22.3 16.9 18 20 13 20S3.7 16.9 2 12.5Z" />
            <circle cx="13" cy="12.5" r="3" />
          </svg>
        )}
      </button>
    </div>
  )
}
