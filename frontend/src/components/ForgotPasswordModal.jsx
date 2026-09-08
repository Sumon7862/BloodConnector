import { useEffect, useState } from 'react'
import Field from './Field.jsx'
import { validateEmail } from '../utils/validation.js'
import { btnPrimary, inputClass } from '../lib/classes.js'

export default function ForgotPasswordModal({ open, onClose }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    function onKey(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  async function handleSubmit(event) {
    event.preventDefault()
    const nextError = validateEmail(email)
    setError(nextError)
    if (nextError) return
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setLoading(false)
    setSubmitted(true)
  }

  function handleClose() {
    setEmail('')
    setError('')
    setSubmitted(false)
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-900/45 p-4 sm:place-items-center sm:p-5 dark:bg-slate-950/70" role="presentation" onClick={handleClose}>
      <div
        className="mb-[env(safe-area-inset-bottom)] w-[min(420px,100%)] rounded-[14px] border border-slate-200 bg-white p-5 shadow-xl sm:mb-0 sm:p-7 dark:border-slate-700 dark:bg-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-title"
        onClick={(event) => event.stopPropagation()}
      >
        {submitted ? (
          <>
            <h2 id="forgot-title" className="m-0 text-[22px] font-bold">Check your inbox</h2>
            <p className="mt-2 mb-5 text-sm leading-relaxed text-slate-500">
              If an account exists for {email.trim()}, you will receive a reset link shortly.
            </p>
            <button type="button" className={btnPrimary} onClick={handleClose}>
              Back to login
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <h2 id="forgot-title" className="m-0 text-[22px] font-bold">Forgot password</h2>
            <p className="mt-2 mb-5 text-sm leading-relaxed text-slate-500">
              Enter the email on your account and we will send a reset link.
            </p>
            <Field id="reset-email" label="Email" error={error}>
              <input
                id="reset-email"
                type="email"
                autoComplete="email"
                placeholder="your.email@example.com"
                value={email}
                className={`${inputClass} ${error ? 'border-brand' : ''}`}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (error) setError(validateEmail(event.target.value))
                }}
              />
            </Field>
            <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" className="h-12 rounded-lg px-4 font-bold text-slate-500 hover:bg-rose-50 hover:text-slate-800 sm:w-auto dark:hover:bg-brand/15" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className={`${btnPrimary} sm:w-auto sm:px-5`} disabled={loading}>
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
