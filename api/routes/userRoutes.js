import express from 'express'

import UserController from '../controllers/userController.js';
import { validateUser } from '../validators/userValidator.js';
import { checkAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', validateUser, UserController.register);
router.post('/create-admin', checkAdmin, UserController.createAdmin);

export default router;