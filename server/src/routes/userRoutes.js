import express from 'express';
import { updateProfile } from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// All user routes are protected
router.use(protect);

// Update current user profile
router.put('/profile', updateProfile);

export default router;
