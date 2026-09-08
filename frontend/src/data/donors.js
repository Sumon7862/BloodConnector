export const DONATION_TYPES = ['Whole Blood', 'Platelets', 'Plasma']

export function getDonorStats(donor) {
  const donations = donor.donations || []
  const total = donations.length
  const year = String(new Date().getFullYear())
  const bloodDonated = donations.reduce((sum, item) => sum + (Number(item.amountMl) || 0), 0)
  const thisYear = donations.filter((item) => String(item.date || '').includes(year)).length
  return {
    total,
    bloodDonated,
    thisYear,
    livesImpacted: total * 3,
  }
}

export function donationTypeClass(type) {
  if (type === 'Platelets') return 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300'
  if (type === 'Plasma') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300'
  return 'bg-rose-100 text-brand dark:bg-brand/15'
}
