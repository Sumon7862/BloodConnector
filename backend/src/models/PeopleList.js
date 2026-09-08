import mongoose from 'mongoose'
import { schemaOptions } from '../utils/ids.js'

const peopleListSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    kind: { type: String, enum: ['friends', 'family'], required: true },
    people: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  schemaOptions,
)

peopleListSchema.index({ userId: 1, kind: 1 }, { unique: true })

export const PeopleList = mongoose.model('PeopleList', peopleListSchema)
