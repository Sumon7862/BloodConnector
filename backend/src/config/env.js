import 'dotenv/config'

const isProd = process.env.NODE_ENV === 'production'

if (isProd && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in production')
}
if (isProd && !process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI must be set in production')
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET || 'bloodconnector-dev-secret',
  mongoUri: process.env.MONGODB_URI || '',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@bloodconnector.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'Admin123!',
  corsOrigin: process.env.CORS_ORIGIN || '',
}
