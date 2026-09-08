import { Router } from 'express'
import {
  stats,
  listUsers,
  updateUser,
  listRequests,
  updateRequest,
  deleteRequest,
  donorsAdmin,
  doctorsAdmin,
  banksAdmin,
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

router.get('/doctors', doctorsAdmin.list)
router.post('/doctors', doctorsAdmin.create)
router.patch('/doctors/:id', doctorsAdmin.update)
router.delete('/doctors/:id', doctorsAdmin.remove)

router.get('/banks', banksAdmin.list)
router.post('/banks', banksAdmin.create)
router.patch('/banks/:id', banksAdmin.update)
router.delete('/banks/:id', banksAdmin.remove)

router.get('/opinions', listOpinions)
router.patch('/opinions/:id', updateOpinion)
router.delete('/opinions/:id', deleteOpinion)

export default router
