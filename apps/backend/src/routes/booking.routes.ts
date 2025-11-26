import { Router } from 'express';
import { createBooking, verifyPayment, getUserBookings, getVendorBookings } from '../controllers/booking.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createBooking);
router.post('/verify', authenticate, verifyPayment);
router.get('/user', authenticate, getUserBookings);
router.get('/vendor', authenticate, getVendorBookings);

export default router;
