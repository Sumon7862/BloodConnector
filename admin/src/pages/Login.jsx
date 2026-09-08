import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import BrandMark from '../components/BrandMark.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'
import { btnPrimary, inputClass } from '../lib/classes.js'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = 'BloodConnector — Admin login'
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!emailOrPhone.trim() || !password) {
      setError('Email/phone and password are required.')
      return
    }
    setLoading(true)
    const result = await login({ emailOrPhone, password })
    setLoading(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate('/', { replace: true })
  }

  return (
    <div className="grid min-h-svh place-items-center bg-zinc-50 px-4 dark:bg-ink">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <form
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-700 dark:bg-panel"
        onSubmit={handleSubmit}
        noValidate
      >
        <BrandMark to={null} />
        <h1 className="mt-5 mb-1 text-2xl font-extrabold">Admin login</h1>
        <p className="mt-0 mb-6 text-sm text-slate-500">Separate panel for BloodConnector staff.</p>
        <label className="mb-3 block">
          <span className="mb-1.5 block text-sm font-semibold">Email or phone</span>
          <input
            className={inputClass}
            value={emailOrPhone}
            autoComplete="username"
            onChange={(event) => {
              setEmailOrPhone(event.target.value)
              setError('')
            }}
          />
        </label>
        <label className="mb-5 block">
          <span className="mb-1.5 block text-sm font-semibold">Password</span>
          <input
            type="password"
            className={inputClass}
            value={password}
            autoComplete="current-password"
            onChange={(event) => {
              setPassword(event.target.value)
              setError('')
            }}
          />
        </label>
        {error ? <p className="mb-4 text-sm font-medium text-brand">{error}</p> : null}
        <button type="submit" className={btnPrimary} disabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  )
}
