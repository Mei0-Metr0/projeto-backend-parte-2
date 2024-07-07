import express from 'express'

import UserController from '../controllers/userController.js'
import { validateUser } from '../validators/userValidator.js'
import { checkToken, checkAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router();

router.post('/user/register', validateUser, UserController.register)
router.post('/user/create-admin', checkAdmin, UserController.createAdmin)
router.delete('/user/delete-user/:id', checkAdmin, UserController.deleteUser)
router.put('/user/update-user/:id', checkToken, UserController.updateUser)

export default router;