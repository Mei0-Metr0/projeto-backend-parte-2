import express from 'express'

import AdoptionController from '../controllers/adoptionController.js'
import { checkToken } from '../middlewares/authMiddleware.js'

const router = express.Router();

router.post('/adoption/register', checkToken, AdoptionController.register)
router.delete('/adoption/delete-adoption/:id', checkToken, AdoptionController.deleteAdoption)
router.put('/adoption/update-adoption/:id', checkToken, AdoptionController.updateAdoption)
router.get('/adoptions', checkToken, AdoptionController.listAdoptions)
router.get('/adoption/:id', checkToken, AdoptionController.getAdoptionById)

export default router;