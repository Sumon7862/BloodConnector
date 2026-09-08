import { Router } from 'express'
import {
  listRequests,
  createRequest,
  contactRequester,
  respondToRequest,
  dismissRequest,
  closeRequest,
  updateResponse,
} from '../controllers/requestController.js'
import { optionalAuth, requireAuth } from '../middlewares/auth.js'

const router = Router()

router.get('/', optionalAuth, listRequests)
router.post('/', requireAuth, createRequest)
router.post('/:id/contact', requireAuth, contactRequester)
router.post('/:id/respond', requireAuth, respondToRequest)
router.post('/:id/dismiss', requireAuth, dismissRequest)
router.post('/:id/close', requireAuth, closeRequest)
router.post('/:id/responses/:responseId', requireAuth, updateResponse)

export default router
