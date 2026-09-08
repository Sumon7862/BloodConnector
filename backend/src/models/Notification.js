import mongoose from 'mongoose'
import { idField, schemaOptions } from '../utils/ids.js'

const notificationSchema = new mongoose.Schema(
  {
    id: idField,
    userId: { type: String, required: true, index: true },
    title: { type: String, default: 'Update' },
    message: { type: String, default: '' },
    to: { type: String, default: '' },
    tone: { type: String, default: 'drop' },
    unread: { type: Boolean, default: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  schemaOptions,
)

export const Notification = mongoose.model('Notification', notificationSchema)
