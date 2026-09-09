const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

export function digitsOnly(value: string) {
  return String(value || '').replace(/\D/g, '')
}

export function validateEmailOrPhone(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return 'Email or phone is required'
  if (trimmed.includes('@')) return EMAIL_PATTERN.test(trimmed) ? '' : 'Enter a valid email address'
  const digits = digitsOnly(trimmed)
  if (digits.length < 10 || digits.length > 15) return 'Enter a valid phone number'
  return ''
}

export function validateEmail(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return 'Email is required'
  return EMAIL_PATTERN.test(trimmed) ? '' : 'Enter a valid email address'
}

export function validateFullName(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return 'Full name is required'
  if (trimmed.length < 2) return 'Name must be at least 2 characters'
  return ''
}

export function validateAge(value: string) {
  if (value === '' || value == null) return 'Age is required'
  const age = Number(value)
  if (!Number.isInteger(age)) return 'Enter a valid age'
  if (age < 18 || age > 65) return 'Donors must be between 18 and 65'
  return ''
}

export function validateAddress(value: string) {
  const trimmed = String(value || '').trim()
  if (!trimmed) return 'Address is required'
  if (trimmed.length < 5) return 'Enter a valid address'
  return ''
}

export function validateBloodGroup(value: string) {
  if (!value) return 'Please select your blood group'
  return ''
}

export function validatePhone(value: string, required = true) {
  const trimmed = String(value || '').trim()
  if (!trimmed) return required ? 'Phone number is required' : ''
  const digits = digitsOnly(trimmed)
  if (digits.length < 10 || digits.length > 15) return 'Enter a valid phone number'
  return ''
}

export function validatePassword(value: string) {
  if (!value) return 'Password is required'
  if (value.length < 8) return 'Must be at least 8 characters'
  return ''
}

export function validateConfirmPassword(password: string, confirm: string) {
  if (!confirm) return 'Confirm your password'
  if (password !== confirm) return 'Passwords do not match'
  return ''
}

export function validateOpinion(value: string, maxChars = 100) {
  const trimmed = String(value || '').trim()
  if (!trimmed) return 'Please write your opinion.'
  if (trimmed.length > maxChars) return `Opinion cannot be more than ${maxChars} characters.`
  return ''
}

export function validateRating(value: number) {
  if (!Number.isInteger(value) || value < 1 || value > 5) return 'Please select a rating from 1 to 5.'
  return ''
}

export function validateRequired(value: string, message: string) {
  return String(value || '').trim() ? '' : message
}

export function getInitials(name?: string) {
  return String(name || 'U')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function accountKey(emailOrPhone?: string) {
  return String(emailOrPhone || '').trim().toLowerCase()
}
