import { User } from '../models/User.js'
import { Notification } from '../models/Notification.js'

export async function notifyMatchingDonors(request) {
  const accounts = await User.find({
    role: { $ne: 'admin' },
    status: { $ne: 'blocked' },
    bloodGroup: request.bloodType,
    id: { $ne: request.requesterId },
  })
  if (!accounts.length) return
  await Notification.insertMany(
    accounts.map((account) => ({
      userId: account.id,
      title: `${request.bloodType} request from ${request.requesterName}`,
      message: `Needed at ${request.location}. Contact them from your dashboard, or cancel.`,
      to: '/dashboard/open-requests',
      tone: 'drop',
    })),
  )
}
