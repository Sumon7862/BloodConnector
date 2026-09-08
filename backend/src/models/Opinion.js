import mongoose from 'mongoose'
import { idField, schemaOptions } from '../utils/ids.js'

const opinionSchema = new mongoose.Schema(
  {
    id: idField,
    userId: { type: String, default: '', index: true },
    name: String,
    role: String,
    location: { type: String, default: '' },
    rating: { type: Number, default: 5 },
    opinion: { type: String, default: '' },
    photo: { type: String, default: '' },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: String,
    hidden: { type: Boolean, default: false },
  },
  schemaOptions,
)

export const Opinion = mongoose.model('Opinion', opinionSchema)
