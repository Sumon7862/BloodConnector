export function accountKey(value) {
  return String(value || '').trim().toLowerCase()
}

export function matchesBloodGroup(userGroup, neededType) {
  return Boolean(userGroup && neededType && userGroup === neededType)
}

export function publicUser(user) {
  if (!user) return null
  const obj = typeof user.toObject === 'function' ? user.toObject() : { ...user }
  delete obj._id
  delete obj.__v
  delete obj.passwordHash
  return { ...obj, hasPassword: Boolean(user.passwordHash) }
}

export function shapeUser(input = {}, previous = null) {
  const requestedRole = input.role || previous?.role || 'donor'
  const role =
    requestedRole === 'doctor'
      ? 'doctor'
      : requestedRole === 'admin' && previous?.role === 'admin'
        ? 'admin'
        : 'donor'

  return {
    id: previous?.id,
    emailOrPhone: String(input.emailOrPhone ?? previous?.emailOrPhone ?? '').trim(),
    passwordHash: previous?.passwordHash || '',
    name: input.fullName || input.name || previous?.name || 'Member',
    role,
    status: previous?.status || input.status || 'active',
    bloodGroup: input.bloodGroup ?? previous?.bloodGroup ?? '',
    age: input.age ?? previous?.age ?? '',
    address: input.address ?? previous?.address ?? '',
    photo: input.photo ?? previous?.photo ?? '',
    phone: input.phone ?? previous?.phone ?? '',
    phones: Array.isArray(input.phones)
      ? input.phones.map((item) => String(item).trim()).filter(Boolean)
      : previous?.phones || [],
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
    lastDonatedAt: previous?.lastDonatedAt || input.lastDonatedAt || '',
    nextEligibleAt: previous?.nextEligibleAt || input.nextEligibleAt || '',
    donationCount: previous?.donationCount ?? input.donationCount ?? 0,
    consultations: previous?.consultations ?? input.consultations ?? 0,
    rating: previous?.rating ?? input.rating ?? '4.8',
  }
}
