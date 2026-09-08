import mongoose from 'mongoose'
import { idField, schemaOptions } from '../utils/ids.js'

const doctorSchema = new mongoose.Schema(
  {
    id: idField,
    name: { type: String, required: true },
    hidden: { type: Boolean, default: false },
  },
  { ...schemaOptions, strict: false },
)

export const Doctor = mongoose.model('Doctor', doctorSchema)
