const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
export const USER_ROLES = [
  { value: 'donor', label: 'Donor' },
  { value: 'doctor', label: 'Doctor' },
]

export function digitsOnly(value) {
  return String(value || '').replace(/\D/g, '')
}

export function validateEmailOrPhone(value) {
  const trimmed = value.trim()
  if (!trimmed) return 'Email or phone is required'

  if (trimmed.includes('@')) {
    return EMAIL_PATTERN.test(trimmed) ? '' : 'Enter a valid email address'
  }

  const digits = digitsOnly(trimmed)
  if (digits.length < 10 || digits.length > 15) {
    return 'Enter a valid phone number'
  }
  return ''
}

export function validateEmail(value) {
  const trimmed = value.trim()
  if (!trimmed) return 'Email is required'
  return EMAIL_PATTERN.test(trimmed) ? '' : 'Enter a valid email address'
}

export function validateFullName(value) {
  const trimmed = value.trim()
  if (!trimmed) return 'Full name is required'
  if (trimmed.length < 2) return 'Name must be at least 2 characters'
  if (!/^[\p{L}][\p{L} .'-]*$/u.test(trimmed)) return 'Enter a valid full name'
  return ''
}

export function validateAge(value, role = 'donor') {
  if (value === '' || value == null) return 'Age is required'
  const age = Number(value)
  if (!Number.isInteger(age)) return 'Enter a valid age'
  const max = role === 'doctor' ? 80 : 65
  if (age < 18 || age > max) {
    return role === 'doctor' ? 'Doctors must be between 18 and 80' : 'Donors must be between 18 and 65'
  }
  return ''
}

export function validateRole(value) {
  if (value !== 'donor' && value !== 'doctor') return 'Please select Donor or Doctor'
  return ''
}

export function validateAddress(value) {
  const trimmed = String(value || '').trim()
  if (!trimmed) return 'Address is required'
  if (trimmed.length < 5) return 'Enter a valid address'
  return ''
}

export function validateBloodGroup(value) {
  if (!value) return 'Please select your blood group'
  if (!BLOOD_GROUPS.includes(value)) return 'Select a valid blood group'
  return ''
}

export function validatePhone(value, { required = true } = {}) {
  const trimmed = String(value || '').trim()
  if (!trimmed) return required ? 'Phone number is required' : ''
  const digits = digitsOnly(trimmed)
  if (digits.length < 10 || digits.length > 15) return 'Enter a valid phone number'
  return ''
}

export function validatePassword(value, { required = true } = {}) {
  if (!value) return required ? 'Password is required' : ''
  if (value.length < 8) return 'Must be at least 8 characters'
  return ''
}

export function getPasswordStrength(value) {
  if (!value) return { score: 0, label: '', tone: '' }

  let score = 0
  if (value.length >= 8) score += 1
  if (value.length >= 12) score += 1
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1
  if (/\d/.test(value)) score += 1
  if (/[^A-Za-z0-9]/.test(value)) score += 1

  if (score <= 2) return { score, label: 'Weak', tone: 'weak' }
  if (score <= 3) return { score, label: 'Fair', tone: 'fair' }
  if (score <= 4) return { score, label: 'Strong', tone: 'strong' }
  return { score, label: 'Excellent', tone: 'excellent' }
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return 'Confirm your password'
  if (confirmPassword !== password) return 'Passwords do not match'
  return ''
}

export function validateOpinion(value, { maxChars = 100 } = {}) {
  const trimmed = String(value || '').trim()
  if (!trimmed) return 'Please write your opinion.'
  if (trimmed.length > maxChars) return `Opinion cannot be more than ${maxChars} characters.`
  return ''
}

export function validateRating(value) {
  const rating = Number(value)
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return 'Please select a rating from 1 to 5.'
  }
  return ''
}

export function validateRequired(value, message) {
  return String(value || '').trim() ? '' : message
}
