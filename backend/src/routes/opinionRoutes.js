import { Router } from 'express'
import { listOpinions, myOpinion, saveOpinion, deleteMyOpinion } from '../controllers/opinionController.js'
import { optionalAuth, requireAuth } from '../middlewares/auth.js'

const router = Router()

router.get('/', optionalAuth, listOpinions)
router.get('/me', requireAuth, myOpinion)
router.put('/', requireAuth, saveOpinion)
router.delete('/', requireAuth, deleteMyOpinion)

export default router
