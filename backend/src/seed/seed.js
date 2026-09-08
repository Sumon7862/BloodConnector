import { DONORS } from '../../../frontend/src/data/donors.js'
import { env } from '../config/env.js'
import { hashPassword } from '../utils/password.js'
import { User } from '../models/User.js'
import { Donor } from '../models/Donor.js'
import { Doctor } from '../models/Doctor.js'
import { Bank } from '../models/Bank.js'
import { Opinion } from '../models/Opinion.js'
import { BloodRequest } from '../models/Request.js'
import { SEED_DOCTORS } from './data/doctors.js'
import { SEED_BANKS } from './data/banks.js'
import { SEED_OPINIONS } from './data/opinions.js'
import { seedRequests } from './data/requests.js'

export async function seedIfNeeded() {
  if ((await User.countDocuments()) === 0) {
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

  if ((await Donor.countDocuments()) === 0) {
    await Donor.insertMany(DONORS.map((donor) => ({ ...donor, hidden: false })))
  }
  if ((await Doctor.countDocuments()) === 0) {
    await Doctor.insertMany(SEED_DOCTORS)
  }
  if ((await Bank.countDocuments()) === 0) {
    await Bank.insertMany(SEED_BANKS)
  }
  if ((await Opinion.countDocuments()) === 0) {
    await Opinion.insertMany(SEED_OPINIONS)
  }
  if ((await BloodRequest.countDocuments()) === 0) {
    await BloodRequest.insertMany(seedRequests())
  }
}
