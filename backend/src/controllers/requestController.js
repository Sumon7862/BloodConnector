import { BloodRequest } from '../models/Request.js'
import { Notification } from '../models/Notification.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendError } from '../utils/http.js'
import { serialize, uid } from '../utils/ids.js'
import { matchesBloodGroup } from '../utils/user.js'
import { notifyMatchingDonors } from '../services/notificationService.js'

function sanitizeRequest(item, viewer) {
  const isOwner = viewer?.id === item.requesterId
  const isAdmin = viewer?.role === 'admin'
  if (isOwner || isAdmin) return item
  const safe = { ...item }
  delete safe.dismissedBy
  delete safe.responses
  if (!matchesBloodGroup(viewer?.bloodGroup, item.bloodType)) delete safe.contact
  return safe
}

export const listRequests = asyncHandler(async (req, res) => {
  const list = await BloodRequest.find().sort({ createdAt: -1 })
  res.json(serialize(list).map((item) => sanitizeRequest(item, req.user)))
})

export const createRequest = asyncHandler(async (req, res) => {
  const body = req.body || {}
  if (!body.bloodType || !body.location || !body.contact) {
    return sendError(res, 400, 'Blood type, location, and contact are required.')
  }
  const request = await BloodRequest.create({
    requesterId: req.user.id,
    requesterName: req.user.name,
    requesterPhoto: req.user.photo || '',
    bloodType: body.bloodType,
    urgency: body.urgency || 'Regular',
    location: String(body.location).trim(),
    contact: String(body.contact).trim(),
    details: String(body.details || '').trim(),
    status: 'open',
    responses: [],
    dismissedBy: [],
  })
  await notifyMatchingDonors(request)
  res.status(201).json(serialize(request))
})

export const contactRequester = asyncHandler(async (req, res) => {
  const donor = req.user
  const request = await BloodRequest.findOne({ id: req.params.id })
  if (!request || request.status !== 'open') return sendError(res, 404, 'Request not found.')
  if (request.requesterId === donor.id) return sendError(res, 400, 'You cannot contact your own request.')
  if (!matchesBloodGroup(donor.bloodGroup, request.bloodType)) {
    return sendError(res, 400, 'Your blood group does not match this request.')
  }
  const already = request.responses.some((item) => item.donorId === donor.id)
  if (!already) {
    await Notification.create({
      userId: request.requesterId,
      title: `${donor.name} is contacting you`,
      message: `${donor.bloodGroup} donor for your ${request.bloodType} request. Number: ${donor.phone || donor.emailOrPhone || ''}`,
      to: '/dashboard/request-blood',
      tone: 'heart',
    })
    request.responses.unshift({
      id: uid(),
      donorId: donor.id,
      donorName: donor.name,
      donorPhoto: donor.photo || '',
      donorBloodType: donor.bloodGroup || '',
      donorPhone: String(donor.phone || donor.emailOrPhone || '').trim(),
      message: '',
      createdAt: new Date().toISOString(),
      status: 'contacted',
    })
    await request.save()
  }
  res.json(serialize(request))
})

export const respondToRequest = asyncHandler(async (req, res) => {
  const donor = req.user
  const request = await BloodRequest.findOne({ id: req.params.id })
  if (!request || request.status !== 'open') return sendError(res, 404, 'Request not found.')
  if (request.requesterId === donor.id) return sendError(res, 400, 'You cannot offer on your own request.')
  if (request.responses.some((item) => item.donorId === donor.id)) {
    return res.json(serialize(request))
  }
  request.responses.unshift({
    id: uid(),
    donorId: donor.id,
    donorName: donor.name,
    donorPhoto: donor.photo || '',
    donorBloodType: donor.bloodGroup || '',
    donorPhone: String(req.body?.phone || donor.phone || donor.emailOrPhone || '').trim(),
    message: String(req.body?.message || '').trim(),
    createdAt: new Date().toISOString(),
    status: 'offered',
  })
  await Notification.create({
    userId: request.requesterId,
    title: `${donor.name} offered to help`,
    message: `${request.bloodType} request at ${request.location}`,
    to: '/dashboard/request-blood',
    tone: 'heart',
  })
  await request.save()
  res.json(serialize(request))
})

export const dismissRequest = asyncHandler(async (req, res) => {
  const request = await BloodRequest.findOne({ id: req.params.id })
  if (!request) return sendError(res, 404, 'Request not found.')
  if (!request.dismissedBy.includes(req.user.id)) {
    request.dismissedBy.push(req.user.id)
    await request.save()
  }
  res.json(serialize(request))
})

export const closeRequest = asyncHandler(async (req, res) => {
  const status = req.body?.status === 'filled' ? 'filled' : req.body?.status === 'matched' ? 'matched' : 'closed'
  const request = await BloodRequest.findOne({ id: req.params.id })
  if (!request) return sendError(res, 404, 'Request not found.')
  if (request.requesterId !== req.user.id && req.user.role !== 'admin') {
    return sendError(res, 403, 'You can only close your own request.')
  }
  request.status = status
  await request.save()
  res.json(serialize(request))
})

export const updateResponse = asyncHandler(async (req, res) => {
  const status = req.body?.status === 'accepted' ? 'accepted' : 'declined'
  const request = await BloodRequest.findOne({ id: req.params.id })
  if (!request) return sendError(res, 404, 'Request not found.')
  if (request.requesterId !== req.user.id) {
    return sendError(res, 403, 'Only the requester can update offers.')
  }
  request.responses = request.responses.map((item) => {
    if (item.id !== req.params.responseId) {
      return status === 'accepted' && item.status === 'offered' ? { ...item.toObject?.() || item, status: 'declined' } : item
    }
    item.status = status
    return item
  })
  const accepted = request.responses.find((item) => item.id === req.params.responseId)
  if (accepted && status === 'accepted') {
    request.status = 'matched'
    await Notification.create({
      userId: accepted.donorId,
      title: 'Your offer was accepted',
      message: `${request.requesterName} accepted your help for ${request.bloodType} at ${request.location}. Call ${request.contact}.`,
      to: '/dashboard/open-requests',
      tone: 'heart',
    })
  }
  await request.save()
  res.json(serialize(request))
})
