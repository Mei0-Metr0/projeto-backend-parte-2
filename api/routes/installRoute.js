import express from 'express';

import InstallController from '../controllers/installController.js'

const router = express.Router();

router.get('/install', InstallController.addDataBd)

export default router;