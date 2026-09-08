import { randomUUID } from 'node:crypto'

export function uid() {
  return randomUUID()
}

export const idField = {
  type: String,
  unique: true,
  default: uid,
}

export const schemaOptions = {
  versionKey: false,
  toJSON: {
    transform(_doc, ret) {
      delete ret._id
      return ret
    },
  },
  toObject: {
    transform(_doc, ret) {
      delete ret._id
      return ret
    },
  },
}

export function serialize(doc) {
  if (!doc) return null
  if (Array.isArray(doc)) return doc.map(serialize)
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc }
  delete obj._id
  delete obj.__v
  return obj
}
