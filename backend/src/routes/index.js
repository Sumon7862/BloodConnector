import { Router } from 'express'
import authRoutes from './authRoutes.js'
import userRoutes from './userRoutes.js'
import requestRoutes from './requestRoutes.js'
import notificationRoutes from './notificationRoutes.js'
import opinionRoutes from './opinionRoutes.js'
import directoryRoutes from './directoryRoutes.js'
import peopleRoutes from './peopleRoutes.js'
import adminRoutes from './adminRoutes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/requests', requestRoutes)
router.use('/notifications', notificationRoutes)
router.use('/opinions', opinionRoutes)
router.use('/people', peopleRoutes)
router.use('/admin', adminRoutes)
router.use('/', directoryRoutes)

export default router
