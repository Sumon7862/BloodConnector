import { User } from '../models/User.js'
import { BloodRequest } from '../models/Request.js'
import { Donor } from '../models/Donor.js'
import { Opinion } from '../models/Opinion.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendError } from '../utils/http.js'
import { publicUser } from '../utils/user.js'
import { serialize, uid } from '../utils/ids.js'

export const stats = asyncHandler(async (_req, res) => {
  const [
    users,
    donors,
    pending,
    blocked,
    openRequests,
    requests,
    directoryDonors,
    opinions,
  ] = await Promise.all([
    User.countDocuments({ role: { $ne: 'admin' } }),
    User.countDocuments({ role: 'donor' }),
    User.countDocuments({ status: 'pending' }),
    User.countDocuments({ status: 'blocked' }),
    BloodRequest.countDocuments({ status: 'open' }),
    BloodRequest.countDocuments(),
    Donor.countDocuments({ hidden: { $ne: true } }),
    Opinion.countDocuments({ hidden: { $ne: true } }),
  ])
  res.json({
    users,
    donors,
    pending,
    blocked,
    openRequests,
    requests,
    directoryDonors,
    opinions,
  })
})

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find({ role: { $ne: 'admin' } }).sort({ joinedAt: -1 })
  res.json(users.map((item) => publicUser(item)))
})

export const updateUser = asyncHandler(async (req, res) => {
  const body = req.body || {}
  const user = await User.findOne({ id: req.params.id })
  if (!user || user.role === 'admin') return sendError(res, 404, 'User not found.')
  if (body.status && ['pending', 'active', 'blocked'].includes(body.status)) user.status = body.status
  if (body.role && body.role === 'donor') user.role = 'donor'
  await user.save()
  res.json(publicUser(user))
})

export const listRequests = asyncHandler(async (_req, res) => {
  const list = await BloodRequest.find().sort({ createdAt: -1 })
  res.json(serialize(list))
})

export const updateRequest = asyncHandler(async (req, res) => {
  const status = req.body?.status
  if (!['open', 'filled', 'closed', 'matched'].includes(status)) {
    return sendError(res, 400, 'Invalid status.')
  }
  const request = await BloodRequest.findOne({ id: req.params.id })
  if (!request) return sendError(res, 404, 'Request not found.')
  request.status = status
  await request.save()
  res.json(serialize(request))
})

export const deleteRequest = asyncHandler(async (req, res) => {
  await BloodRequest.deleteOne({ id: req.params.id })
  res.json({ ok: true })
})

function directoryCrud(Model) {
  return {
    list: asyncHandler(async (_req, res) => {
      const list = await Model.find()
      res.json(serialize(list))
    }),
    create: asyncHandler(async (req, res) => {
      if (!String(req.body?.name || '').trim()) return sendError(res, 400, 'Name is required.')
      const item = await Model.create({ ...req.body, id: req.body?.id || uid(), hidden: Boolean(req.body?.hidden) })
      res.status(201).json(serialize(item))
    }),
    update: asyncHandler(async (req, res) => {
      const item = await Model.findOne({ id: req.params.id })
      if (!item) return sendError(res, 404, 'Not found.')
      Object.assign(item, { ...req.body, id: req.params.id })
      await item.save()
      res.json(serialize(item))
    }),
    remove: asyncHandler(async (req, res) => {
      await Model.deleteOne({ id: req.params.id })
      res.json({ ok: true })
    }),
  }
}

export const donorsAdmin = directoryCrud(Donor)

export const listOpinions = asyncHandler(async (_req, res) => {
  const list = await Opinion.find().sort({ createdAt: -1 })
  res.json(serialize(list))
})

export const updateOpinion = asyncHandler(async (req, res) => {
  const item = await Opinion.findOne({ id: req.params.id })
  if (!item) return sendError(res, 404, 'Opinion not found.')
  if (typeof req.body?.hidden === 'boolean') item.hidden = req.body.hidden
  await item.save()
  res.json(serialize(item))
})

export const deleteOpinion = asyncHandler(async (req, res) => {
  await Opinion.deleteOne({ id: req.params.id })
  res.json({ ok: true })
})
