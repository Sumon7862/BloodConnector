import { PeopleList } from '../models/PeopleList.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendError } from '../utils/http.js'

async function getList(userId, kind) {
  return PeopleList.findOne({ userId, kind })
}

export const listFriends = asyncHandler(async (req, res) => {
  const row = await getList(req.user.id, 'friends')
  res.json(row?.people || [])
})

export const addFriend = asyncHandler(async (req, res) => {
  const person = req.body || {}
  if (!person.id) return sendError(res, 400, 'Person is required.')
  let row = await getList(req.user.id, 'friends')
  if (!row) row = await PeopleList.create({ userId: req.user.id, kind: 'friends', people: [] })
  if (!row.people.some((item) => item.id === person.id)) {
    row.people.unshift(person)
    await row.save()
  }
  res.json(row.people)
})

export const removeFriend = asyncHandler(async (req, res) => {
  const row = await getList(req.user.id, 'friends')
  if (!row) return res.json([])
  row.people = row.people.filter((item) => item.id !== req.params.id)
  await row.save()
  res.json(row.people)
})

export const getFamily = asyncHandler(async (req, res) => {
  const row = await getList(req.user.id, 'family')
  res.json(row?.people || [])
})

export const saveFamily = asyncHandler(async (req, res) => {
  const people = Array.isArray(req.body) ? req.body : []
  const row = await PeopleList.findOneAndUpdate(
    { userId: req.user.id, kind: 'family' },
    { userId: req.user.id, kind: 'family', people },
    { new: true, upsert: true },
  )
  res.json(row.people)
})
