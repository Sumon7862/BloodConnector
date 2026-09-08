import { Router } from 'express'
import {
  listDonors,
  getDonor,
  listDoctors,
  getDoctor,
  listDoctorReviews,
  addDoctorReview,
  listBanks,
} from '../controllers/directoryController.js'

const router = Router()

router.get('/donors', listDonors)
router.get('/donors/:id', getDonor)
router.get('/doctors', listDoctors)
router.get('/doctors/:id/reviews', listDoctorReviews)
router.post('/doctors/:id/reviews', addDoctorReview)
router.get('/doctors/:id', getDoctor)
router.get('/banks', listBanks)

export default router
