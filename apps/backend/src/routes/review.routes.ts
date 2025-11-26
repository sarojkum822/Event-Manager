import { Router } from 'express';
import { createReview, getVendorReviews, respondToReview } from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public route - anyone can view reviews
router.get('/vendor/:vendorId', getVendorReviews);

// Protected routes - require authentication
router.post('/', authenticate, createReview);
router.post('/:id/response', authenticate, respondToReview);

export default router;
