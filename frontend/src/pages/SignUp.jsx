import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import Field from '../components/Field.jsx'
import PasswordInput from '../components/PasswordInput.jsx'
import BloodGroupSelect from '../components/BloodGroupSelect.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { readImageFile, homePath } from '../lib/user.js'
import { openAdminApp } from '../lib/apps.js'
import {
  getPasswordStrength,
  validateAddress,
  validateAge,
  validateBloodGroup,
  validateConfirmPassword,
  validateEmailOrPhone,
  validateFullName,
  validatePassword,
} from '../utils/validation.js'
import { btnPrimary, inputClass } from '../lib/classes.js'

const INITIAL = {
  fullName: '',
  emailOrPhone: '',
  address: '',
  photo: '',
  bloodGroup: '',
  age: '',
  password: '',
  confirmPassword: '',
}

export default function SignUp() {
  const location = useLocation()
  const navigate = useNavigate()
  const { register } = useAuth()
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const strength = getPasswordStrength(values.password)

  useEffect(() => {
    document.title = 'BloodConnector — Create Account'
  }, [])

  function setField(name, value) {
    const nextValues = { ...values, [name]: value }
    setValues(nextValues)
    if (touched[name]) {
      setErrors((current) => ({
        ...current,
        [name]: fieldError(name, value, nextValues),
        ...(name === 'password' && touched.confirmPassword
          ? { confirmPassword: validateConfirmPassword(value, nextValues.confirmPassword) }
          : {}),
      }))
    }
  }

  function handleBlur(name) {
    setTouched((current) => ({ ...current, [name]: true }))
    setErrors((current) => ({ ...current, [name]: fieldError(name, values[name], values) }))
  }

  function validateAll() {
    const next = {
      fullName: validateFullName(values.fullName),
      emailOrPhone: validateEmailOrPhone(values.emailOrPhone),
      address: validateAddress(values.address),
      bloodGroup: validateBloodGroup(values.bloodGroup),
      age: validateAge(values.age),
      password: validatePassword(values.password),
      confirmPassword: validateConfirmPassword(values.password, values.confirmPassword),
    }
    setErrors(next)
    setTouched({
      fullName: true,
      emailOrPhone: true,
      address: true,
      bloodGroup: true,
      age: true,
      password: true,
      confirmPassword: true,
    })
    return Object.values(next).every((message) => !message)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validateAll()) return

    setLoading(true)
    const result = await register({
      fullName: values.fullName,
      emailOrPhone: values.emailOrPhone,
      role: 'donor',
      address: values.address,
      photo: values.photo,
      bloodGroup: values.bloodGroup,
      age: values.age,
      password: values.password,
      email: values.emailOrPhone.includes('@') ? values.emailOrPhone : '',
      phone: values.emailOrPhone.includes('@') ? '' : values.emailOrPhone,
    })
    setLoading(false)
    if (result.adminRedirect) {
      if (!openAdminApp()) {
        setErrors((current) => ({ ...current, emailOrPhone: 'Use the admin panel to sign in.' }))
        setTouched((current) => ({ ...current, emailOrPhone: true }))
      }
      return
    }
    if (!result.ok) {
      setErrors((current) => ({ ...current, emailOrPhone: result.error }))
      setTouched((current) => ({ ...current, emailOrPhone: true }))
      return
    }
    const from = location.state?.from
    navigate(typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') ? from : homePath(result.user), { replace: true })
  }

  const passwordOk = values.password.length >= 8

  return (
    <AuthLayout>
      <form className="flex flex-col" onSubmit={handleSubmit} noValidate>
        <div className="mb-[22px]">
          <h2 id="auth-card-title" className="m-0 text-xl font-bold tracking-tight sm:text-2xl">Create Account</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">Create a donor account to request blood and donate blood</p>
        </div>

        <Field id="full-name" label="Full Name" error={touched.fullName ? errors.fullName : ''}>
          <input
            id="full-name"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            value={values.fullName}
            className={`${inputClass} ${touched.fullName && errors.fullName ? 'border-brand' : ''}`}
            onChange={(event) => setField('fullName', event.target.value)}
            onBlur={() => handleBlur('fullName')}
          />
        </Field>

        <Field
          id="signup-contact"
          label="Email or Phone"
          error={touched.emailOrPhone ? errors.emailOrPhone : ''}
        >
          <input
            id="signup-contact"
            type="text"
            autoComplete="username"
            placeholder="your.email@example.com"
            value={values.emailOrPhone}
            className={`${inputClass} ${touched.emailOrPhone && errors.emailOrPhone ? 'border-brand' : ''}`}
            onChange={(event) => setField('emailOrPhone', event.target.value)}
            onBlur={() => handleBlur('emailOrPhone')}
          />
        </Field>

        <Field id="signup-address" label="Address" error={touched.address ? errors.address : ''}>
          <input
            id="signup-address"
            type="text"
            autoComplete="street-address"
            placeholder="West Kazipara, Mirpur-1216"
            value={values.address}
            className={`${inputClass} ${touched.address && errors.address ? 'border-brand' : ''}`}
            onChange={(event) => setField('address', event.target.value)}
            onBlur={() => handleBlur('address')}
          />
        </Field>

        <Field id="signup-photo" label="Profile photo" hint="Optional. JPG or PNG under 1.2 MB.">
          <div className="flex items-center gap-3">
            {values.photo ? (
              <img src={values.photo} alt="" className="h-12 w-12 rounded-full object-cover" />
            ) : null}
            <label className="inline-flex h-11 cursor-pointer items-center rounded-lg border border-slate-300 px-4 text-sm font-bold hover:border-brand hover:text-brand dark:border-slate-600">
              {values.photo ? 'Change photo' : 'Upload photo'}
              <input
                id="signup-photo"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={async (event) => {
                  const file = event.target.files?.[0]
                  if (!file) return
                  try {
                    setField('photo', await readImageFile(file))
                    setErrors((current) => ({ ...current, photo: '' }))
                  } catch (err) {
                    setErrors((current) => ({ ...current, photo: err.message }))
                  }
                }}
              />
            </label>
          </div>
          {errors.photo ? <p className="m-0 text-xs text-brand">{errors.photo}</p> : null}
        </Field>

        <Field
          id="blood-group"
          label="Select blood Group"
          error={touched.bloodGroup ? errors.bloodGroup : ''}
        >
          <BloodGroupSelect
            id="blood-group"
            value={values.bloodGroup}
            error={touched.bloodGroup ? errors.bloodGroup : ''}
            onChange={(value) => {
              setTouched((current) => ({ ...current, bloodGroup: true }))
              setField('bloodGroup', value)
            }}
            onBlur={() => handleBlur('bloodGroup')}
          />
        </Field>

        <Field id="age" label="Age" error={touched.age ? errors.age : ''}>
          <input
            id="age"
            type="number"
            inputMode="numeric"
            min="18"
            max="65"
            placeholder="28"
            className={`${inputClass} ${touched.age && errors.age ? 'border-brand' : ''}`}
            value={values.age}
            onChange={(event) => setField('age', event.target.value)}
            onBlur={() => handleBlur('age')}
          />
        </Field>

        <Field
          id="signup-password"
          label="Password"
          error={touched.password ? errors.password : ''}
          hint={touched.password && errors.password ? '' : 'Must be at least 8 characters'}
          hintOk={passwordOk}
        >
          <PasswordInput
            id="signup-password"
            autoComplete="new-password"
            placeholder="••••••••"
            invalid={Boolean(touched.password && errors.password)}
            value={values.password}
            onChange={(event) => setField('password', event.target.value)}
            onBlur={() => handleBlur('password')}
          />
          {values.password ? (
            <div className="mt-1 flex items-center justify-between gap-3" aria-live="polite">
              <div className="grid flex-1 grid-cols-4 gap-1">
                {[1, 2, 3, 4].map((level) => {
                  const filled =
                    (strength.tone === 'weak' && level <= 1) ||
                    (strength.tone === 'fair' && level <= 2) ||
                    (strength.tone === 'strong' && level <= 3) ||
                    (strength.tone === 'excellent' && level <= 4)
                  const color =
                    strength.tone === 'weak'
                      ? 'bg-brand'
                      : strength.tone === 'fair'
                        ? 'bg-amber-600'
                        : 'bg-emerald-600'
                  return (
                    <span
                      key={level}
                      className={`h-1 rounded-full ${filled ? color : 'bg-slate-200 dark:bg-slate-600'}`}
                    />
                  )
                })}
              </div>
              <small
                className={`text-[11px] font-semibold ${
                  strength.tone === 'weak'
                    ? 'text-brand'
                    : strength.tone === 'fair'
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                }`}
              >
                {strength.label}
              </small>
            </div>
          ) : null}
        </Field>

        <Field
          id="confirm-password"
          label="Confirm Password"
          error={touched.confirmPassword ? errors.confirmPassword : ''}
        >
          <PasswordInput
            id="confirm-password"
            autoComplete="new-password"
            placeholder="••••••••"
            invalid={Boolean(touched.confirmPassword && errors.confirmPassword)}
            value={values.confirmPassword}
            onChange={(event) => setField('confirmPassword', event.target.value)}
            onBlur={() => handleBlur('confirmPassword')}
          />
        </Field>

        <button type="submit" className={btnPrimary} disabled={loading}>
          {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" /> : null}
          {loading ? 'Creating account…' : 'Create Account'}
        </button>

        <p className="mt-[18px] text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" state={location.state} className="font-bold text-brand no-underline hover:underline">Login</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

function fieldError(name, value, values) {
  switch (name) {
    case 'fullName':
      return validateFullName(value)
    case 'emailOrPhone':
      return validateEmailOrPhone(value)
    case 'address':
      return validateAddress(value)
    case 'bloodGroup':
      return validateBloodGroup(value)
    case 'age':
      return validateAge(value)
    case 'password':
      return validatePassword(value)
    case 'confirmPassword':
      return validateConfirmPassword(values.password, value)
    default:
      return ''
  }
}
