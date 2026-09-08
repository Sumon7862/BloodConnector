import { Router } from 'express'
import { listNotifications, replaceNotifications } from '../controllers/notificationController.js'
import { requireAuth } from '../middlewares/auth.js'

const router = Router()

router.get('/', requireAuth, listNotifications)
router.put('/', requireAuth, replaceNotifications)

export default router
