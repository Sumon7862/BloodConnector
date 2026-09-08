import { Router } from 'express'
import { register, login, me, changePassword, resetPassword } from '../controllers/authController.js'
import { requireAuth } from '../middlewares/auth.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', requireAuth, me)
router.post('/change-password', requireAuth, changePassword)
router.post('/reset-password', resetPassword)

export default router
