import mongoose from 'mongoose'
import { env } from '../config/env.js'

export async function connectDb() {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is missing. Add it to backend/.env')
  }
  mongoose.set('strictQuery', true)
  await mongoose.connect(env.mongoUri)
  console.log('MongoDB connected')
}
