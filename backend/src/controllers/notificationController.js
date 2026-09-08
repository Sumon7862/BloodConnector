import { Notification } from '../models/Notification.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { uid } from '../utils/ids.js'
import { noteForClient } from '../utils/time.js'

export const listNotifications = asyncHandler(async (req, res) => {
  const notes = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 })
  res.json(notes.map(noteForClient))
})

export const replaceNotifications = asyncHandler(async (req, res) => {
  const incoming = Array.isArray(req.body) ? req.body : []
  await Notification.deleteMany({ userId: req.user.id })
  const mine = incoming.map((item) => ({
    id: item.id || uid(),
    userId: req.user.id,
    title: item.title || 'Update',
    message: item.message || '',
    to: item.to || '',
    tone: item.tone || 'drop',
    unread: Boolean(item.unread),
    createdAt: item.createdAt || new Date().toISOString(),
  }))
  if (mine.length) await Notification.insertMany(mine)
  res.json(mine.map(noteForClient))
})
