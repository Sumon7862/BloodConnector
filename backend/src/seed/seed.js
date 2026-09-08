import { env } from '../config/env.js'
import { hashPassword } from '../utils/password.js'
import { User } from '../models/User.js'

export async function seedIfNeeded() {
  if ((await User.countDocuments({ role: 'admin' })) === 0) {
    await User.create({
      emailOrPhone: env.adminEmail,
      passwordHash: hashPassword(env.adminPassword),
      name: 'Site Admin',
      role: 'admin',
      status: 'active',
      email: env.adminEmail,
      address: 'Dhaka',
      donationCount: 0,
      consultations: 0,
      rating: '',
    })
    console.log(`Seeded admin: ${env.adminEmail}`)
  }
}
