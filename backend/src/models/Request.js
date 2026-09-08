import mongoose from 'mongoose'
import { idField, schemaOptions, uid } from '../utils/ids.js'

const responseSchema = new mongoose.Schema(
  {
    id: { type: String, default: uid },
    donorId: String,
    donorName: String,
    donorPhoto: { type: String, default: '' },
    donorBloodType: { type: String, default: '' },
    donorPhone: { type: String, default: '' },
    message: { type: String, default: '' },
    createdAt: { type: String, default: () => new Date().toISOString() },
    status: { type: String, default: 'offered' },
  },
  { _id: false },
)

const requestSchema = new mongoose.Schema(
  {
    id: idField,
    requesterId: { type: String, required: true },
    requesterName: { type: String, default: 'Member' },
    requesterPhoto: { type: String, default: '' },
    bloodType: { type: String, required: true },
    urgency: { type: String, default: 'Regular' },
    location: { type: String, default: '' },
    contact: { type: String, default: '' },
    details: { type: String, default: '' },
    createdAt: { type: String, default: () => new Date().toISOString() },
    status: { type: String, enum: ['open', 'filled', 'closed', 'matched'], default: 'open' },
    responses: { type: [responseSchema], default: [] },
    dismissedBy: { type: [String], default: [] },
  },
  schemaOptions,
)

requestSchema.index({ createdAt: -1 })
requestSchema.index({ status: 1, bloodType: 1 })

export const BloodRequest = mongoose.model('BloodRequest', requestSchema)
