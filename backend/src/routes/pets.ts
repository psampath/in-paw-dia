import { Router } from 'express';
import {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
} from '../controllers/petController';
import { authenticate } from '../middleware/auth';
import { requireEditor, requireAdmin } from '../middleware/roleCheck';
import { petValidation } from '../utils/validators';

const router = Router();

// Public routes
router.get('/', getAllPets);
router.get('/:id', getPetById);

// Protected routes (editor or admin can create/update)
router.post('/', authenticate, requireEditor, petValidation, createPet);
router.put('/:id', authenticate, requireEditor, petValidation, updatePet);

// Admin only routes
router.delete('/:id', authenticate, requireAdmin, deletePet);

export default router;
