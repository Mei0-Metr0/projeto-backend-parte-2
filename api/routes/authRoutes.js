import express from 'express'

import LoginController from '../controllers/loginController.js'
import { validateLogin } from '../validators/loginValidator.js'

const router = express.Router();

router.post('/login', validateLogin, LoginController.login)

export default router;