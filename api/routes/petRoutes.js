import express from 'express'

import PetController from '../controllers/petController.js'
import { checkToken, checkAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router();

router.post('/pet/register', checkToken, PetController.register)
router.delete('/pet/delete-pet/:id', checkToken, PetController.deletePet)
router.put('/pet/update-pet/:id', checkToken, PetController.updatePet)
router.get('/pets', PetController.listPets)
router.get('/pet/:id', PetController.getPetById)

export default router;