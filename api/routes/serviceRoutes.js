import express from 'express'

import ServiceController from '../controllers/serviceController.js'
import { checkToken, checkAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router();

router.post('/service/register', ServiceController.createService)
router.delete('/service/delete-service/:id', ServiceController.deleteService)
router.put('/service/update-service/:id', ServiceController.updateService)
router.get('/services', ServiceController.listServices)
router.get('/service/:id', ServiceController.getServiceById)

export default router;