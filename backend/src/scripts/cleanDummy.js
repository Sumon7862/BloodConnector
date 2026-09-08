import { connectDb } from '../db/connect.js'
import { User } from '../models/User.js'
import { Donor } from '../models/Donor.js'
import { Doctor } from '../models/Doctor.js'
import { Bank } from '../models/Bank.js'
import { Opinion } from '../models/Opinion.js'
import { BloodRequest } from '../models/Request.js'
import { DoctorReview } from '../models/DoctorReview.js'
import { Notification } from '../models/Notification.js'
import { PeopleList } from '../models/PeopleList.js'

async function cleanDummy() {
  await connectDb()
  const [donors, doctors, banks, opinions, requests, reviews, notes, people, dummyUsers] = await Promise.all([
    Donor.deleteMany({}),
    Doctor.deleteMany({}),
    Bank.deleteMany({}),
    Opinion.deleteMany({}),
    BloodRequest.deleteMany({}),
    DoctorReview.deleteMany({}),
    Notification.deleteMany({}),
    PeopleList.deleteMany({}),
    User.deleteMany({ role: { $ne: 'admin' } }),
  ])
  console.log('Removed dummy directory, requests, opinions, and non-admin users.')
  console.log({
    donors: donors.deletedCount,
    doctors: doctors.deletedCount,
    banks: banks.deletedCount,
    opinions: opinions.deletedCount,
    requests: requests.deletedCount,
    reviews: reviews.deletedCount,
    notifications: notes.deletedCount,
    peopleLists: people.deletedCount,
    users: dummyUsers.deletedCount,
  })
  process.exit(0)
}

cleanDummy().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
