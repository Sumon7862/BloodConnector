import { connectDb } from '../db/connect.js'
import { hashPassword } from '../utils/password.js'
import { shapeUser } from '../utils/user.js'
import { uid } from '../utils/ids.js'
import { User } from '../models/User.js'
import { Donor } from '../models/Donor.js'
import { BloodRequest } from '../models/Request.js'

export const DUMMY_PASSWORD = 'DummyTest@2026'

export const DUMMY_USERS = [
  { fullName: 'Dummy Donor O+', email: 'dummy.oplus.bc@gmail.com', bloodGroup: 'O+', age: '28', address: 'Dhanmondi, Dhaka', phone: '01700001001', available: true },
  { fullName: 'Dummy Donor O-', email: 'dummy.ominus.bc@gmail.com', bloodGroup: 'O-', age: '32', address: 'Gulshan, Dhaka', phone: '01700001002', available: true },
  { fullName: 'Dummy Donor A+', email: 'dummy.aplus.bc@gmail.com', bloodGroup: 'A+', age: '24', address: 'Agrabad, Chattogram', phone: '01700001003', available: true },
  { fullName: 'Dummy Donor A-', email: 'dummy.aminus.bc@gmail.com', bloodGroup: 'A-', age: '36', address: 'Khulshi, Chattogram', phone: '01700001004', available: false },
  { fullName: 'Dummy Donor B+', email: 'dummy.bplus.bc@gmail.com', bloodGroup: 'B+', age: '29', address: 'Rajshahi Sadar', phone: '01700001005', available: true },
  { fullName: 'Dummy Donor B-', email: 'dummy.bminus.bc@gmail.com', bloodGroup: 'B-', age: '41', address: 'Sylhet Sadar', phone: '01700001006', available: true },
  { fullName: 'Dummy Donor AB+', email: 'dummy.abplus.bc@gmail.com', bloodGroup: 'AB+', age: '27', address: 'Barishal City', phone: '01700001007', available: true },
  { fullName: 'Dummy Donor AB-', email: 'dummy.abminus.bc@gmail.com', bloodGroup: 'AB-', age: '33', address: 'Rangpur City', phone: '01700001008', available: false },
  { fullName: 'Dummy Donor O+ Dhaka', email: 'dummy.oplus.dhaka.bc@gmail.com', bloodGroup: 'O+', age: '22', address: 'Mirpur 10, Dhaka', phone: '01700001009', available: true },
  { fullName: 'Dummy Donor A+ CTG', email: 'dummy.aplus.ctg.bc@gmail.com', bloodGroup: 'A+', age: '30', address: 'Pahartali, Chattogram', phone: '01700001010', available: true },
]

function waitingUntil() {
  return new Date(Date.now() + 40 * 86_400_000).toISOString()
}

export async function seedDummyUsers() {
  await connectDb()
  const created = []

  for (const item of DUMMY_USERS) {
    let user = await User.findByLogin(item.email)
    if (!user) {
      const shaped = shapeUser({
        fullName: item.fullName,
        emailOrPhone: item.email,
        email: item.email,
        phone: item.phone,
        role: 'donor',
        status: 'active',
        bloodGroup: item.bloodGroup,
        age: item.age,
        address: item.address,
        available: item.available,
        nextEligibleAt: item.available ? '' : waitingUntil(),
      })
      delete shaped.id
      user = await User.create({
        ...shaped,
        passwordHash: hashPassword(DUMMY_PASSWORD),
      })
    }

    const donorQuery = { email: item.email }
    const donorPayload = {
      name: item.fullName,
      bloodType: item.bloodGroup,
      location: item.address,
      area: item.address,
      city: item.address.split(',').pop()?.trim() || item.address,
      phone: item.phone,
      email: item.email,
      nextEligibleAt: item.available ? '' : waitingUntil(),
      status: item.available ? 'Active' : 'Waiting',
      hidden: false,
    }
    const existingDonor = await Donor.findOne(donorQuery)
    if (existingDonor) {
      Object.assign(existingDonor, donorPayload)
      await existingDonor.save()
    } else {
      await Donor.create({ id: uid(), ...donorPayload })
    }
    created.push({ name: item.fullName, email: item.email, bloodGroup: item.bloodGroup, phone: item.phone, id: user.id })
  }

  const byEmail = Object.fromEntries(created.map((item) => [item.email, item]))
  const sampleRequests = [
    {
      from: 'dummy.aplus.bc@gmail.com',
      bloodType: 'O+',
      urgency: 'Critical',
      location: 'Square Hospital, Dhaka',
      details: 'DUMMY TEST REQUEST — O+ needed for surgery. Safe to contact dummy donor.',
    },
    {
      from: 'dummy.oplus.bc@gmail.com',
      bloodType: 'A+',
      urgency: 'High',
      location: 'Chittagong Medical College',
      details: 'DUMMY TEST REQUEST — A+ needed. Remove from admin when testing is done.',
    },
    {
      from: 'dummy.abplus.bc@gmail.com',
      bloodType: 'B+',
      urgency: 'Regular',
      location: 'Rajshahi Medical College',
      details: 'DUMMY TEST REQUEST — B+ needed. Dummy account only.',
    },
  ]

  for (const item of sampleRequests) {
    const owner = byEmail[item.from]
    if (!owner) continue
    const exists = await BloodRequest.findOne({ requesterId: owner.id, details: item.details })
    if (exists) continue
    await BloodRequest.create({
      requesterId: owner.id,
      requesterName: owner.name,
      bloodType: item.bloodType,
      urgency: item.urgency,
      location: item.location,
      contact: owner.phone,
      details: item.details,
      status: 'open',
      responses: [],
      dismissedBy: [],
    })
  }

  return created
}

if (import.meta.url.endsWith('seedDummyUsers.js') || process.argv[1]?.includes('seedDummyUsers')) {
  seedDummyUsers()
    .then((list) => {
      console.log(`Seeded ${list.length} dummy users (password: ${DUMMY_PASSWORD})`)
      for (const item of list) {
        console.log(`${item.bloodGroup.padEnd(4)}  ${item.email}  ${item.phone}  ${item.name}`)
      }
      process.exit(0)
    })
    .catch((error) => {
      console.error(error.message || error)
      process.exit(1)
    })
}
