import { Opinion } from '../models/Opinion.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendError } from '../utils/http.js'
import { serialize } from '../utils/ids.js'

export const listOpinions = asyncHandler(async (_req, res) => {
  const list = await Opinion.find({ hidden: { $ne: true } }).sort({ createdAt: -1 })
  res.json(serialize(list))
})

export const myOpinion = asyncHandler(async (req, res) => {
  const mine = await Opinion.findOne({ userId: req.user.id, hidden: { $ne: true } })
  res.json(serialize(mine))
})

export const saveOpinion = asyncHandler(async (req, res) => {
  const body = req.body || {}
  const text = String(body.opinion || '').trim()
  if (!text) return sendError(res, 400, 'Opinion is required.')
  const existing = await Opinion.findOne({ userId: req.user.id })
  const record = {
    userId: req.user.id,
    name: req.user.name,
    role: 'Donor',
    location: req.user.address || '',
    rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
    opinion: text.slice(0, 100),
    photo: req.user.photo || '',
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hidden: false,
  }
  if (existing) {
    Object.assign(existing, record)
    await existing.save()
  } else {
    await Opinion.create(record)
  }
  const list = await Opinion.find({ hidden: { $ne: true } }).sort({ createdAt: -1 })
  res.json(serialize(list))
})

export const deleteMyOpinion = asyncHandler(async (req, res) => {
  await Opinion.deleteOne({ userId: req.user.id })
  const list = await Opinion.find({ hidden: { $ne: true } }).sort({ createdAt: -1 })
  res.json(serialize(list))
})
