import { Donor } from '../models/Donor.js'
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
