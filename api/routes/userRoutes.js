import express from 'express'

import UserController from '../controllers/userController.js';
import { validateUser } from '../validators/userValidator.js';
import { checkAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/user/register', validateUser, UserController.register);
router.post('/user/create-admin', checkAdmin, UserController.createAdmin);
router.delete('/user/delete-user/:id', checkAdmin, UserController.deleteUser);

export default router;