import mongoose from 'mongoose'
import { idField, schemaOptions } from '../utils/ids.js'
import { accountKey } from '../utils/user.js'

function escapeRegex(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const userSchema = new mongoose.Schema(
  {
    id: idField,
    emailOrPhone: { type: String, required: true, unique: true },
    passwordHash: { type: String, default: '' },
    name: { type: String, default: 'Member' },
    role: { type: String, enum: ['donor', 'doctor', 'admin'], default: 'donor' },
    status: { type: String, enum: ['pending', 'active', 'blocked'], default: 'active' },
    bloodGroup: { type: String, default: '' },
    age: { type: String, default: '' },
    address: { type: String, default: '' },
    photo: { type: String, default: '' },
    phone: { type: String, default: '' },
    phones: { type: [String], default: [] },
    email: { type: String, default: '' },
    weight: { type: String, default: '' },
    emergencyContact: { type: String, default: '' },
    medicalConditions: { type: String, default: '' },
    available: { type: Boolean, default: true },
    joinedAt: { type: String, default: () => new Date().toISOString() },
    lastDonatedAt: { type: String, default: '' },
    nextEligibleAt: { type: String, default: '' },
    donationCount: { type: Number, default: 0 },
  },
  schemaOptions,
)

userSchema.index({ email: 1 })
userSchema.index({ phone: 1 })

userSchema.statics.findByLogin = function findByLogin(emailOrPhone) {
  const key = accountKey(emailOrPhone)
  if (!key) return this.findOne({ id: '__none__' })
  const exact = new RegExp(`^${escapeRegex(key)}$`, 'i')
  return this.findOne({
    $or: [{ emailOrPhone: exact }, { email: exact }, { phone: exact }],
  })
}

export const User = mongoose.model('User', userSchema)
