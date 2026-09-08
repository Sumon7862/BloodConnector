import mongoose from 'mongoose'
import { idField, schemaOptions } from '../utils/ids.js'

const bankSchema = new mongoose.Schema(
  {
    id: idField,
    name: { type: String, required: true },
    hidden: { type: Boolean, default: false },
    units: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { ...schemaOptions, strict: false },
)

export const Bank = mongoose.model('Bank', bankSchema)
