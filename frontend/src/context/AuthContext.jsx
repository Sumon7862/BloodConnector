import { createContext, useContext, useMemo, useState } from 'react'
import { accountKey } from '../lib/user.js'
import { defaultDonorEligibility } from '../lib/eligibility.js'

const STORAGE_KEY = 'bloodconnector-user'
const ACCOUNTS_KEY = 'bloodconnector-accounts'
const AuthContext = createContext(null)

function readUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function readAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '{}')
  } catch {
    return {}
  }
}

function withoutPassword(record) {
  if (!record || typeof record !== 'object') return record
  const { password: _password, ...rest } = record
  return rest
}

function normalizePhones(input, previous) {
  if (Array.isArray(input.phones)) {
    return input.phones.map((item) => String(item).trim()).filter(Boolean)
  }
  return Array.isArray(previous?.phones) ? previous.phones : []
}

function normalizeUser(input = {}, previous = null) {
  const role = input.role || previous?.role || 'donor'
  const seeded = defaultDonorEligibility()
  return {
    name: input.fullName || input.name || previous?.name || 'Member',
    emailOrPhone: input.emailOrPhone ?? previous?.emailOrPhone ?? '',
    bloodGroup: input.bloodGroup || previous?.bloodGroup || '',
    age: input.age ?? previous?.age ?? '',
    role: role === 'doctor' ? 'doctor' : 'donor',
    address: input.address ?? previous?.address ?? '',
    photo: input.photo ?? previous?.photo ?? '',
    phone: input.phone ?? previous?.phone ?? '',
    phones: normalizePhones(input, previous),
    email: input.email ?? previous?.email ?? '',
    weight: input.weight ?? previous?.weight ?? '',
    emergencyContact: input.emergencyContact ?? previous?.emergencyContact ?? '',
    medicalConditions: input.medicalConditions ?? previous?.medicalConditions ?? '',
    specialization: input.specialization ?? previous?.specialization ?? 'General Physician',
    registration: input.registration ?? previous?.registration ?? '',
    hospital: input.hospital ?? previous?.hospital ?? '',
    experience: input.experience ?? previous?.experience ?? '5',
    bio: input.bio ?? previous?.bio ?? '',
    available: input.available ?? previous?.available ?? true,
    joinedAt: previous?.joinedAt || input.joinedAt || new Date().toISOString(),
    lastDonatedAt: previous?.lastDonatedAt || input.lastDonatedAt || seeded.lastDonatedAt,
    nextEligibleAt: previous?.nextEligibleAt || input.nextEligibleAt || seeded.nextEligibleAt,
    donationCount: previous?.donationCount ?? input.donationCount ?? 12,
    consultations: previous?.consultations ?? input.consultations ?? 48,
    rating: previous?.rating ?? input.rating ?? '4.8',
  }
}

function persistUser(user, password, previousEmailOrPhone) {
  try {
    const safe = withoutPassword(user)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe))
    if (!safe.emailOrPhone) return
    const accounts = readAccounts()
    const key = accountKey(safe.emailOrPhone)
    const oldKey = accountKey(previousEmailOrPhone)
    let prev = accounts[key] || {}
    if (oldKey && oldKey !== key && accounts[oldKey]) {
      prev = { ...accounts[oldKey], ...prev }
      delete accounts[oldKey]
    }
    accounts[key] = {
      ...prev,
      ...safe,
      password: password ?? prev.password ?? '',
    }
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
  } catch {
    /* ignore quota / private mode */
  }
}

function findAccount(emailOrPhone) {
  const accounts = readAccounts()
  const key = accountKey(emailOrPhone)
  if (accounts[key]) return { key, account: accounts[key] }
  const match = Object.entries(accounts).find(([, account]) => {
    return (
      accountKey(account.emailOrPhone) === key ||
      accountKey(account.email) === key ||
      accountKey(account.phone) === key
    )
  })
  return match ? { key: match[0], account: match[1] } : { key, account: null }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null
    const raw = readUser()
    if (!raw) return null
    const next = normalizeUser(raw, raw)
    persistUser(next, undefined, raw.emailOrPhone)
    return next
  })
  const [secretTick, setSecretTick] = useState(0)

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      hasPassword: Boolean(user && findAccount(user.emailOrPhone).account?.password),
      listMembers() {
        return Object.values(readAccounts()).map((account) => withoutPassword(account))
      },
      register(nextUser) {
        const existing = findAccount(nextUser.emailOrPhone).account
        if (existing) {
          return { ok: false, error: 'An account already exists for that email or phone.' }
        }
        const next = normalizeUser(nextUser)
        persistUser(next, nextUser.password)
        setUser(next)
        return { ok: true }
      },
      login(nextUser) {
        const saved = findAccount(nextUser.emailOrPhone).account
        if (saved?.password && saved.password !== nextUser.password) {
          return { ok: false, error: 'Incorrect password.' }
        }
        const next = normalizeUser(nextUser, saved)
        persistUser(next, nextUser.password || saved?.password)
        setUser(next)
        return { ok: true }
      },
      updateUser(patch) {
        const previousEmail = user?.emailOrPhone
        const next = normalizeUser({ ...user, ...patch }, user)
        persistUser(next, undefined, previousEmail)
        setUser(next)
        return next
      },
      changePassword(currentPassword, nextPassword) {
        if (!user) return { ok: false, error: 'Please login first.' }
        const { account } = findAccount(user.emailOrPhone)
        if (account?.password && account.password !== currentPassword) {
          return { ok: false, error: 'Current password is incorrect.' }
        }
        persistUser(user, nextPassword, user.emailOrPhone)
        setSecretTick((tick) => tick + 1)
        return { ok: true }
      },
      resetPassword(emailOrPhone, nextPassword) {
        const { key, account } = findAccount(emailOrPhone)
        if (!account) return { ok: false, error: 'No account found for that email or phone.' }
        const accounts = readAccounts()
        accounts[key] = { ...account, password: nextPassword }
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
        return { ok: true }
      },
      logout() {
        try {
          localStorage.removeItem(STORAGE_KEY)
        } catch {
          /* ignore */
        }
        setUser(null)
      },
    }),
    [user, secretTick],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
