export function getInitials(name) {
  return String(name || 'U')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function roleLabel(role) {
  return role === 'doctor' ? 'Doctor' : 'Donor'
}

export function readImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Please choose a photo.'))
      return
    }
    if (file.size > 1_200_000) {
      reject(new Error('Please choose a photo under 1.2 MB.'))
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Could not read that photo.'))
    reader.readAsDataURL(file)
  })
}
