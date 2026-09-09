import { connectDb } from '../db/connect.js'
import { User } from '../models/User.js'
import { Donor } from '../models/Donor.js'
import { Opinion } from '../models/Opinion.js'
import { BloodRequest } from '../models/Request.js'
import { Notification } from '../models/Notification.js'
import { PeopleList } from '../models/PeopleList.js'

async function cleanDummy() {
  await connectDb()
  const [donors, opinions, requests, notes, people, dummyUsers] = await Promise.all([
    Donor.deleteMany({}),
    Opinion.deleteMany({}),
    BloodRequest.deleteMany({}),
    Notification.deleteMany({}),
    PeopleList.deleteMany({}),
    User.deleteMany({ role: { $ne: 'admin' } }),
  ])
  console.log('Removed dummy directory, requests, opinions, and non-admin users.')
  console.log({
    donors: donors.deletedCount,
    opinions: opinions.deletedCount,
    requests: requests.deletedCount,
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
