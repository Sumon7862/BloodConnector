import { useEffect, useState } from 'react'
import Field from './Field.jsx'
import PasswordInput from './PasswordInput.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { validateConfirmPassword, validateEmailOrPhone, validatePassword } from '../utils/validation.js'
import { btnPrimary, inputClass } from '../lib/classes.js'

export default function ForgotPasswordModal({ open, onClose }) {
  const { resetPassword } = useAuth()
  const [contact, setContact] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [passError, setPassError] = useState('')
  const [confirmError, setConfirmError] = useState('')
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
    const nextError = validateEmailOrPhone(contact)
    const nextPass = validatePassword(password)
    const nextConfirm = validateConfirmPassword(password, confirm)
    setError(nextError)
    setPassError(nextPass)
    setConfirmError(nextConfirm)
    if (nextError || nextPass || nextConfirm) return
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    const result = resetPassword(contact, password)
    setLoading(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setSubmitted(true)
  }

  function handleClose() {
    setContact('')
    setPassword('')
    setConfirm('')
    setError('')
    setPassError('')
    setConfirmError('')
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
            <h2 id="forgot-title" className="m-0 text-[22px] font-bold">Password updated</h2>
            <p className="mt-2 mb-5 text-sm leading-relaxed text-slate-500">
              You can now login with the new password for {contact.trim()}.
            </p>
            <button type="button" className={btnPrimary} onClick={handleClose}>
              Back to login
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <h2 id="forgot-title" className="m-0 text-[22px] font-bold">Forgot password</h2>
            <p className="mt-2 mb-5 text-sm leading-relaxed text-slate-500">
              Enter the email or phone on your account and choose a new password.
            </p>
            <Field id="reset-contact" label="Email or Phone" error={error}>
              <input
                id="reset-contact"
                type="text"
                autoComplete="username"
                placeholder="your.email@example.com"
                value={contact}
                className={`${inputClass} ${error ? 'border-brand' : ''}`}
                onChange={(event) => {
                  setContact(event.target.value)
                  if (error) setError(validateEmailOrPhone(event.target.value))
                }}
              />
            </Field>
            <Field id="reset-password" label="New password" error={passError}>
              <PasswordInput
                id="reset-password"
                autoComplete="new-password"
                invalid={Boolean(passError)}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Field>
            <Field id="reset-confirm" label="Confirm password" error={confirmError}>
              <PasswordInput
                id="reset-confirm"
                autoComplete="new-password"
                invalid={Boolean(confirmError)}
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
              />
            </Field>
            <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" className="h-12 rounded-lg px-4 font-bold text-slate-500 hover:bg-rose-50 hover:text-slate-800 sm:w-auto dark:hover:bg-brand/15" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className={`${btnPrimary} sm:w-auto sm:px-5`} disabled={loading}>
                {loading ? 'Saving…' : 'Update password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
