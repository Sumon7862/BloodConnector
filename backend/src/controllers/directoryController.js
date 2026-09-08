import { Donor } from '../models/Donor.js'
import { Doctor } from '../models/Doctor.js'
import { Bank } from '../models/Bank.js'
import { DoctorReview } from '../models/DoctorReview.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendError } from '../utils/http.js'
import { serialize } from '../utils/ids.js'

export const listDonors = asyncHandler(async (_req, res) => {
  const list = await Donor.find({ hidden: { $ne: true } })
  res.json(serialize(list))
})

export const getDonor = asyncHandler(async (req, res) => {
  const donor = await Donor.findOne({ id: req.params.id, hidden: { $ne: true } })
  if (!donor) return sendError(res, 404, 'Donor not found.')
  res.json(serialize(donor))
})

export const listDoctors = asyncHandler(async (_req, res) => {
  const list = await Doctor.find({ hidden: { $ne: true } })
  res.json(serialize(list))
})

export const getDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ id: req.params.id, hidden: { $ne: true } })
  if (!doctor) return sendError(res, 404, 'Doctor not found.')
  res.json(serialize(doctor))
})

export const listDoctorReviews = asyncHandler(async (req, res) => {
  const list = await DoctorReview.find({ doctorId: req.params.id }).sort({ createdAt: -1 })
  res.json(serialize(list))
})

export const addDoctorReview = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ id: req.params.id, hidden: { $ne: true } })
  if (!doctor) return sendError(res, 404, 'Doctor not found.')
  const body = req.body || {}
  if (!String(body.name || '').trim() || !String(body.comment || '').trim()) {
    return sendError(res, 400, 'Please enter your name and comment.')
  }
  await DoctorReview.create({
    doctorId: req.params.id,
    name: String(body.name).trim(),
    comment: String(body.comment).trim(),
  })
  const list = await DoctorReview.find({ doctorId: req.params.id }).sort({ createdAt: -1 })
  res.status(201).json(serialize(list))
})

export const listBanks = asyncHandler(async (_req, res) => {
  const list = await Bank.find({ hidden: { $ne: true } })
  res.json(serialize(list))
})
