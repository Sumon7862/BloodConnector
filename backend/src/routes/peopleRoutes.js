import { Router } from 'express'
import { listFriends, addFriend, removeFriend, getFamily, saveFamily } from '../controllers/peopleController.js'
import { requireAuth } from '../middlewares/auth.js'

const router = Router()

router.get('/friends', requireAuth, listFriends)
router.post('/friends', requireAuth, addFriend)
router.delete('/friends/:id', requireAuth, removeFriend)
router.get('/family', requireAuth, getFamily)
router.put('/family', requireAuth, saveFamily)

export default router
