import { useEffect, useState } from 'react'
import DashPageHead from '../../components/DashPageHead.jsx'
import Field from '../../components/Field.jsx'
import PasswordInput from '../../components/PasswordInput.jsx'
import { Icon } from '../../components/DashIcons.jsx'
import { cardClass, dashInput } from '../../lib/classes.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { validateConfirmPassword, validatePassword } from '../../utils/validation.js'

const KEY = 'bloodconnector-settings'

const DEFAULTS = {
  email: true,
  push: true,
  campaigns: true,
  urgent: true,
  twoFactor: false,
  showPhone: true,
  showEmail: true,
}

function loadSettings() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') }
  } catch {
    return DEFAULTS
  }
}

export default function SettingsPage() {
  const { changePassword, hasPassword } = useAuth()
  const [settings, setSettings] = useState(() => loadSettings())
  const [panel, setPanel] = useState('')
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [passErrors, setPassErrors] = useState({})
  const [passSaved, setPassSaved] = useState(false)

  useEffect(() => {
    document.title = 'BloodConnector — Settings'
  }, [])

  function persistSettings(next) {
    setSettings(next)
    localStorage.setItem(KEY, JSON.stringify(next))
  }

  function toggle(key) {
    persistSettings({ ...settings, [key]: !settings[key] })
  }

  async function handlePassword(event) {
    event.preventDefault()
    const nextErrors = {
      current: hasPassword && !passwords.current ? 'Current password is required' : '',
      next: validatePassword(passwords.next),
      confirm: validateConfirmPassword(passwords.next, passwords.confirm),
    }
    setPassErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return
    const result = await changePassword(passwords.current, passwords.next)
    if (!result.ok) {
      setPassErrors({ current: result.error })
      return
    }
    setPasswords({ current: '', next: '', confirm: '' })
    setPassSaved(true)
  }

  const rows = [
    ['email', 'Email Notifications', 'Receive updates via email'],
    ['push', 'Push Notifications', 'Get real-time alerts on your device'],
    ['campaigns', 'Gallery Alerts', 'Notify about new community stories'],
    ['urgent', 'Urgent Blood Requests', 'Emergency blood needed notifications'],
  ]

  const privacyRows = [
    ['showPhone', 'Show phone number', 'Let other members see your primary number'],
    ['showEmail', 'Show email address', 'Let other members see your email'],
  ]

  return (
    <div>
      <DashPageHead title="Settings" subtitle="Stay updated with your blood donation activities" />

      <section className={`${cardClass} p-5 sm:p-6`}>
        <h2 className="m-0 flex items-center gap-2 text-lg font-extrabold">
          <Icon name="bell" className="h-5 w-5 text-brand" /> Notifications
        </h2>
        <div className="mt-5 space-y-4">
          {rows.map(([key, title, copy]) => (
            <ToggleRow
              key={key}
              title={title}
              copy={copy}
              on={settings[key]}
              onToggle={() => toggle(key)}
            />
          ))}
        </div>
      </section>

      <section className={`${cardClass} mt-5 p-5 sm:p-6`}>
        <h2 className="m-0 flex items-center gap-2 text-lg font-extrabold">
          <Icon name="shield" className="h-5 w-5 text-brand" /> Privacy & Security
        </h2>
        <div className="mt-4 grid gap-3">
          <button
            type="button"
            className="inline-flex h-12 items-center gap-3 rounded-lg border border-rose-200 px-4 font-bold text-brand hover:bg-rose-50 dark:border-brand/30 dark:hover:bg-brand/15"
            onClick={() => {
              setPanel((current) => (current === 'password' ? '' : 'password'))
              setPassSaved(false)
            }}
          >
            <Icon name="lock" className="h-5 w-5" />
            {hasPassword ? 'Change Password' : 'Set Password'}
          </button>
          {panel === 'password' ? (
            <form className="rounded-xl border border-slate-200 p-4 dark:border-slate-700" onSubmit={handlePassword}>
              {hasPassword ? (
                <Field id="current-password" label="Current password" error={passErrors.current}>
                  <PasswordInput
                    id="current-password"
                    autoComplete="current-password"
                    inputClassName={dashInput}
                    invalid={Boolean(passErrors.current)}
                    value={passwords.current}
                    onChange={(event) => setPasswords({ ...passwords, current: event.target.value })}
                  />
                </Field>
              ) : (
                <p className="mt-0 mb-4 text-sm text-slate-500">Create a password for this account.</p>
              )}
              <Field id="new-password" label="New password" error={passErrors.next}>
                <PasswordInput
                  id="new-password"
                  autoComplete="new-password"
                  inputClassName={dashInput}
                  invalid={Boolean(passErrors.next)}
                  value={passwords.next}
                  onChange={(event) => setPasswords({ ...passwords, next: event.target.value })}
                />
              </Field>
              <Field id="confirm-new-password" label="Confirm new password" error={passErrors.confirm}>
                <PasswordInput
                  id="confirm-new-password"
                  autoComplete="new-password"
                  inputClassName={dashInput}
                  invalid={Boolean(passErrors.confirm)}
                  value={passwords.confirm}
                  onChange={(event) => setPasswords({ ...passwords, confirm: event.target.value })}
                />
              </Field>
              {passSaved ? <p className="mt-0 mb-3 text-sm font-medium text-emerald-600">Password updated.</p> : null}
              <button type="submit" className="inline-flex h-11 items-center rounded-lg bg-brand px-4 text-sm font-bold text-white hover:bg-brand-hover">
                {hasPassword ? 'Update password' : 'Save password'}
              </button>
            </form>
          ) : null}

          <button
            type="button"
            className="inline-flex h-12 items-center gap-3 rounded-lg border border-rose-200 px-4 font-bold text-brand hover:bg-rose-50 dark:border-brand/30 dark:hover:bg-brand/15"
            onClick={() => toggle('twoFactor')}
          >
            <Icon name="shield" className="h-5 w-5" />
            Two Factor Authentication {settings.twoFactor ? '(On)' : '(Off)'}
          </button>
          {settings.twoFactor ? (
            <p className="m-0 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
              Two-factor prompts are enabled for this device.
            </p>
          ) : null}

          <button
            type="button"
            className="inline-flex h-12 items-center gap-3 rounded-lg border border-rose-200 px-4 font-bold text-brand hover:bg-rose-50 dark:border-brand/30 dark:hover:bg-brand/15"
            onClick={() => setPanel((current) => (current === 'privacy' ? '' : 'privacy'))}
          >
            <Icon name="globe" className="h-5 w-5" />
            Privacy Settings
          </button>
          {panel === 'privacy' ? (
            <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              {privacyRows.map(([key, title, copy]) => (
                <ToggleRow
                  key={key}
                  title={title}
                  copy={copy}
                  on={settings[key]}
                  onToggle={() => toggle(key)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}

function ToggleRow({ title, copy, on, onToggle }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="m-0 font-bold">{title}</p>
        <p className="mt-0.5 mb-0 text-sm text-slate-500">{copy}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        className={`relative h-7 w-12 shrink-0 overflow-hidden rounded-full p-0.5 transition ${on ? 'bg-brand' : 'bg-slate-300 dark:bg-slate-600'}`}
        onClick={onToggle}
      >
        <span
          className={`block h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            on ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}
