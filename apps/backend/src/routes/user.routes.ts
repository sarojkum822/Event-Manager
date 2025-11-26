import { Router } from 'express';
import { getProfile, updateProfile, uploadAvatar } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { uploadSingle } from '../middleware/upload.middleware';

const router = Router();

// All routes require authentication
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/avatar', authenticate, uploadSingle, uploadAvatar);

export default router;
