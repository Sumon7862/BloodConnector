import { User } from '../models/User.js'
import { verifyToken } from '../utils/jwt.js'
import { sendError } from '../utils/http.js'

function readToken(req) {
  const header = req.headers.authorization || ''
  return header.startsWith('Bearer ') ? header.slice(7) : ''
}

async function attachUser(req) {
  const token = readToken(req)
  if (!token) return null
  try {
    const payload = verifyToken(token)
    const user = await User.findOne({ id: payload.id })
    if (!user || user.status === 'blocked') return null
    req.user = user
    return user
  } catch {
    return null
  }
}

export async function requireAuth(req, res, next) {
  try {
    const user = await attachUser(req)
    if (!user) return sendError(res, 401, 'Please login first.')
    next()
  } catch (error) {
    next(error)
  }
}

export async function optionalAuth(req, res, next) {
  try {
    await attachUser(req)
    next()
  } catch (error) {
    next(error)
  }
}

export async function requireAdmin(req, res, next) {
  try {
    const user = await attachUser(req)
    if (!user) return sendError(res, 401, 'Please login first.')
    if (user.role !== 'admin') return sendError(res, 403, 'Admin access required.')
    next()
  } catch (error) {
    next(error)
  }
}
