import { Router } from 'express'
import {
  stats,
  listUsers,
  updateUser,
  listRequests,
  updateRequest,
  deleteRequest,
  donorsAdmin,
  listOpinions,
  updateOpinion,
  deleteOpinion,
} from '../controllers/adminController.js'
import { requireAdmin } from '../middlewares/auth.js'

const router = Router()

router.use(requireAdmin)

router.get('/stats', stats)
router.get('/users', listUsers)
router.patch('/users/:id', updateUser)
router.get('/requests', listRequests)
router.patch('/requests/:id', updateRequest)
router.delete('/requests/:id', deleteRequest)

router.get('/donors', donorsAdmin.list)
router.post('/donors', donorsAdmin.create)
router.patch('/donors/:id', donorsAdmin.update)
router.delete('/donors/:id', donorsAdmin.remove)

router.get('/opinions', listOpinions)
router.patch('/opinions/:id', updateOpinion)
router.delete('/opinions/:id', deleteOpinion)

export default router
