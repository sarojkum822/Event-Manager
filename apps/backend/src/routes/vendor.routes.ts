import { Router } from 'express';
import {
    getVendorById,
    searchVendors,
    createVendorProfile,
    updateVendorProfile,
    getMyVendorProfile,
    uploadVendorImages,
} from '../controllers/vendor.controller';
import { authenticate } from '../middleware/auth.middleware';
import { uploadMultiple } from '../middleware/upload.middleware';

const router = Router();

// Public routes
router.get('/search', searchVendors);
router.get('/:id', getVendorById);

// Protected routes
router.post('/', authenticate, createVendorProfile);
router.put('/:id', authenticate, updateVendorProfile);
router.get('/my/profile', authenticate, getMyVendorProfile);
router.post('/upload', authenticate, uploadMultiple, uploadVendorImages);

export default router;

