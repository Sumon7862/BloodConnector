import { useEffect, useId, useRef, useState } from 'react'
import { BLOOD_GROUPS } from '../utils/validation.js'
import { inputClass } from '../lib/classes.js'
import BloodTypeBadge from './BloodTypeBadge.jsx'

export default function BloodGroupSelect({ id, value, onChange, onBlur, error }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const fallbackId = useId()
  const selectId = id || fallbackId

  useEffect(() => {
    function handlePointer(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    function handleKey(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  return (
    <div className="relative" ref={rootRef}>
      <button
        id={selectId}
        type="button"
        className={`${inputClass} flex items-center justify-between text-left ${error ? 'border-brand' : ''} ${value ? '' : 'text-slate-400'}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onBlur={onBlur}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={value ? 'flex items-center gap-2 text-slate-900 dark:text-white' : ''}>
          {value ? <BloodTypeBadge type={value} size="sm" /> : 'Select your blood group'}
        </span>
        <svg viewBox="0 0 24 24" className={`h-[18px] w-[18px] fill-none stroke-current stroke-[1.8] text-slate-500 transition ${open ? 'rotate-180' : ''}`} aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <ul className="absolute top-[calc(100%+6px)] z-10 m-0 max-h-60 w-full list-none overflow-auto rounded-[10px] border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-panel" role="listbox" aria-labelledby={selectId}>
          {BLOOD_GROUPS.map((group) => (
            <li key={group}>
              <button
                type="button"
                role="option"
                aria-selected={value === group}
                className={`flex w-full items-center gap-2 rounded-md border-0 bg-transparent px-3 py-2.5 text-left ${value === group ? 'bg-rose-50 dark:bg-brand/15' : 'hover:bg-rose-50 dark:hover:bg-brand/15'}`}
                onClick={() => {
                  onChange(group)
                  setOpen(false)
                }}
              >
                <BloodTypeBadge type={group} size="sm" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
