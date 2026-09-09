export function getInitials(name) {
  return String(name || 'U')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function roleLabel(role) {
  if (role === 'admin') return 'Admin'
  return 'Donor'
}

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
export const BLOOD_TYPES = BLOOD_GROUPS
