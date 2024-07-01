import express from 'express'
import User from '../models/User.js'

import genericController from '../controllers/crudController.js';
import checkUserExistence from '../controllers/userExistenceCheck.js';
import { validateUser } from '../validators/userValidator.js';

const router = express.Router();

const userController = genericController(User, checkUserExistence);

router.post('/auth/register', validateUser, userController.create);

export default router;