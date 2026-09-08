import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import Field from '../components/Field.jsx'
import PasswordInput from '../components/PasswordInput.jsx'
import ForgotPasswordModal from '../components/ForgotPasswordModal.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { validateEmailOrPhone, validatePassword } from '../utils/validation.js'
import { btnPrimary, inputClass } from '../lib/classes.js'

const INITIAL = { emailOrPhone: '', password: '' }

export default function Login() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [toast, setToast] = useState(location.state?.toast || null)

  useEffect(() => {
    document.title = 'BloodConnector — Login'
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(null), 4200)
    return () => clearTimeout(timer)
  }, [toast])

  function setField(name, value) {
    setValues((current) => ({ ...current, [name]: value }))
    if (touched[name]) {
      setErrors((current) => ({ ...current, [name]: fieldError(name, value, values) }))
    }
  }

  function handleBlur(name) {
    setTouched((current) => ({ ...current, [name]: true }))
    setErrors((current) => ({ ...current, [name]: fieldError(name, values[name], values) }))
  }

  function validateAll() {
    const next = {
      emailOrPhone: validateEmailOrPhone(values.emailOrPhone),
      password: validatePassword(values.password),
    }
    setErrors(next)
    setTouched({ emailOrPhone: true, password: true })
    return !next.emailOrPhone && !next.password
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validateAll()) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 900))
    login({
      name: values.emailOrPhone.includes('@') ? values.emailOrPhone.split('@')[0] : 'Member',
      emailOrPhone: values.emailOrPhone,
    })
    setLoading(false)
    navigate('/', { replace: true })
  }

  return (
    <AuthLayout toast={toast}>
      <form className="flex flex-col" onSubmit={handleSubmit} noValidate>
        <div className="mb-[22px]">
          <h2 id="auth-card-title" className="m-0 text-xl font-bold tracking-tight sm:text-2xl">Welcome to your Account</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">Join our community and save lives through blood donation</p>
        </div>

        <Field id="login-contact" label="Email or Phone" error={touched.emailOrPhone ? errors.emailOrPhone : ''}>
          <input
            id="login-contact"
            type="text"
            autoComplete="username"
            placeholder="your.email@example.com"
            value={values.emailOrPhone}
            className={`${inputClass} ${touched.emailOrPhone && errors.emailOrPhone ? 'border-brand' : ''}`}
            onChange={(event) => setField('emailOrPhone', event.target.value)}
            onBlur={() => handleBlur('emailOrPhone')}
          />
        </Field>

        <Field id="login-password" label="Password" error={touched.password ? errors.password : ''}>
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            invalid={Boolean(touched.password && errors.password)}
            value={values.password}
            onChange={(event) => setField('password', event.target.value)}
            onBlur={() => handleBlur('password')}
          />
        </Field>

        <button type="button" className="-mt-1 mb-[18px] self-start border-0 bg-transparent p-0 text-[13px] font-semibold text-brand hover:underline" onClick={() => setForgotOpen(true)}>
          Forgot Password
        </button>

        <button type="submit" className={btnPrimary} disabled={loading}>
          {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" /> : null}
          {loading ? 'Logging in…' : 'Login'}
        </button>

        <p className="mt-[18px] text-center text-sm text-slate-500">
          Do not have an account? <Link to="/signup" className="font-bold text-brand no-underline hover:underline">Create Account</Link>
        </p>
      </form>

      <ForgotPasswordModal open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </AuthLayout>
  )
}

function fieldError(name, value) {
  if (name === 'emailOrPhone') return validateEmailOrPhone(value)
  if (name === 'password') return validatePassword(value)
  return ''
}
