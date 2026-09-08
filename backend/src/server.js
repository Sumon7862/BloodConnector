import { env } from './config/env.js'
import { connectDb } from './db/connect.js'
import { seedIfNeeded } from './seed/seed.js'
import { createApp } from './app.js'

async function start() {
  await connectDb()
  await seedIfNeeded()
  const app = createApp()
  app.listen(env.port, () => {
    console.log(`BloodConnector API on http://127.0.0.1:${env.port}`)
  })
}

start().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
