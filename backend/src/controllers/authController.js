import { User } from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendError } from '../utils/http.js'
import { hashPassword, checkPassword, passwordError } from '../utils/password.js'
import { signToken } from '../utils/jwt.js'
import { accountKey, publicUser, shapeUser } from '../utils/user.js'

const resetAttempts = new Map()

function resetLimited(key) {
  const now = Date.now()
  const recent = (resetAttempts.get(key) || []).filter((time) => now - time < 15 * 60 * 1000)
  if (recent.length >= 5) return true
  recent.push(now)
  resetAttempts.set(key, recent)
  return false
}

export const register = asyncHandler(async (req, res) => {
  const body = req.body || {}
  if (!body.emailOrPhone || !body.password) {
    return sendError(res, 400, 'Email or phone and password are required.')
  }
  const weak = passwordError(body.password)
  if (weak) return sendError(res, 400, weak)
  const existing = await User.findByLogin(body.emailOrPhone)
  if (existing) return sendError(res, 409, 'An account already exists for that email or phone.')

  const user = shapeUser({
    ...body,
    role: 'donor',
    status: 'active',
    email: body.email || (String(body.emailOrPhone).includes('@') ? body.emailOrPhone : ''),
    phone: body.phone || (String(body.emailOrPhone).includes('@') ? '' : body.emailOrPhone),
  })
  const payload = {
    ...user,
    passwordHash: hashPassword(body.password),
  }
  if (!payload.id) delete payload.id
  const created = await User.create(payload)
  res.status(201).json({ token: signToken(created), user: publicUser(created) })
})

export const login = asyncHandler(async (req, res) => {
  const { emailOrPhone, password } = req.body || {}
  const user = await User.findByLogin(emailOrPhone)
  if (!user) return sendError(res, 404, 'No account found for that email or phone.')
  if (user.status === 'blocked') return sendError(res, 403, 'This account is blocked.')
  if (!checkPassword(password, user.passwordHash)) {
    return sendError(res, 401, 'Incorrect password.')
  }
  res.json({ token: signToken(user), user: publicUser(user) })
})

export const me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) })
})

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, nextPassword } = req.body || {}
  const weak = passwordError(nextPassword)
  if (weak) return sendError(res, 400, weak)
  const user = await User.findOne({ id: req.user.id })
  if (!user) return sendError(res, 401, 'Please login first.')
  if (user.passwordHash && !checkPassword(currentPassword, user.passwordHash)) {
    return sendError(res, 400, 'Current password is incorrect.')
  }
  user.passwordHash = hashPassword(nextPassword)
  await user.save()
  res.json({ ok: true, user: publicUser(user) })
})

export const resetPassword = asyncHandler(async (req, res) => {
  const { emailOrPhone, nextPassword } = req.body || {}
  const key = accountKey(emailOrPhone)
  if (!key) return sendError(res, 400, 'Email or phone is required.')
  if (resetLimited(key)) return sendError(res, 429, 'Too many reset attempts. Try again later.')
  const weak = passwordError(nextPassword)
  if (weak) return sendError(res, 400, weak)
  const user = await User.findByLogin(emailOrPhone)
  if (!user || user.role === 'admin') {
    return sendError(res, 404, 'No account found for that email or phone.')
  }
  user.passwordHash = hashPassword(nextPassword)
  await user.save()
  res.json({ ok: true })
})

export const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findOne({ id: req.user.id })
  if (!user) return sendError(res, 401, 'Please login first.')
  const next = shapeUser(req.body || {}, user.toObject())
  Object.assign(user, {
    ...next,
    passwordHash: user.passwordHash,
    role: user.role,
    status: user.status,
    id: user.id,
  })
  await user.save()
  res.json({ user: publicUser(user) })
})
