import express from 'express'
import cors from 'cors'
import apiRoutes from './routes/index.js'
import { env } from './config/env.js'
import { errorHandler, notFound } from './utils/http.js'

export function createApp() {
  const app = express()
  const origins = env.corsOrigin
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  app.use(origins.length ? cors({ origin: origins, credentials: true }) : cors())
  app.use(express.json({ limit: '5mb' }))
  app.get('/api/health', (_req, res) => res.json({ ok: true }))
  app.use('/api', apiRoutes)
  app.use(notFound)
  app.use(errorHandler)
  return app
}
