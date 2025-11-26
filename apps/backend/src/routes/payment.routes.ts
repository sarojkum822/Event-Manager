import { Router } from 'express';
import { razorpayWebhook, getPaymentHistory } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Webhook route - no authentication (Razorpay calls this)
router.post('/webhook', razorpayWebhook);

// Protected routes
router.get('/history', authenticate, getPaymentHistory);

export default router;
