import { Router } from 'express'
import { listDonors, getDonor } from '../controllers/directoryController.js'

const router = Router()

router.get('/donors', listDonors)
router.get('/donors/:id', getDonor)

export default router
