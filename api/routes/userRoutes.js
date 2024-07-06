import express from 'express'

import UserController from '../controllers/userController.js';
import { validateUser } from '../validators/userValidator.js';

const router = express.Router();

router.post('/register', validateUser, UserController.register);

export default router;