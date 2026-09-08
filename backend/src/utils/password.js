import bcrypt from 'bcryptjs'

export function hashPassword(password) {
  return bcrypt.hashSync(password, 10)
}

export function passwordError(password) {
  if (!password || String(password).length < 8) return 'Password must be at least 8 characters.'
  return ''
}

export function checkPassword(password, hash) {
  return bcrypt.compareSync(String(password || ''), hash || '')
}
