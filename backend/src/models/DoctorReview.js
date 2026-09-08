import mongoose from 'mongoose'
import { idField, schemaOptions } from '../utils/ids.js'

const reviewSchema = new mongoose.Schema(
  {
    id: idField,
    doctorId: { type: String, required: true, index: true },
    name: String,
    comment: String,
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  schemaOptions,
)

export const DoctorReview = mongoose.model('DoctorReview', reviewSchema)
