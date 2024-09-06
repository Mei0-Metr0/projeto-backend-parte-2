import express from 'express'

import PetController from '../controllers/petController.js'
import { checkToken } from '../middlewares/authMiddleware.js'
import upload from '../middlewares/upload.js'

const router = express.Router();

router.post('/pet/register', checkToken, upload.single('image'), PetController.register)
router.delete('/pet/delete-pet/:id', checkToken, PetController.deletePet)
router.put('/pet/update-pet/:id', checkToken, upload.single('image'), PetController.updatePet)
router.get('/pets', PetController.listPets)
router.get('/pet/:id', PetController.getPetById)

export default router;