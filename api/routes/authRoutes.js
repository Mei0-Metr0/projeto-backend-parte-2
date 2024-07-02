import express from 'express';

import login from '../controllers/authController.js';
import { validateLogin } from '../validators/loginValidator.js';

const router = express.Router();

router.post('/auth/login', validateLogin, login);

export default router;