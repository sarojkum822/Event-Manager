import { Router } from 'express';
import {
    getPendingVendors,
    verifyVendor,
    getAnalytics,
    getAllBookings,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAllVendors,
    updateVendor,
    deleteVendor,
    updateBooking,
    deleteBooking,
    getAllReviews,
    deleteReview,
} from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';
import { UserRole } from '@event-planner/shared';

const router = Router();

// User Management
router.get('/users', authenticate, authorize(UserRole.ADMIN), getAllUsers);
router.get('/users/:id', authenticate, authorize(UserRole.ADMIN), getUserById);
router.put('/users/:id', authenticate, authorize(UserRole.ADMIN), updateUser);
router.delete('/users/:id', authenticate, authorize(UserRole.ADMIN), deleteUser);

// Vendor Management
router.get('/vendors', authenticate, authorize(UserRole.ADMIN), getAllVendors);
router.get('/vendors/pending', authenticate, authorize(UserRole.ADMIN), getPendingVendors);
router.put('/vendors/:id/verify', authenticate, authorize(UserRole.ADMIN), verifyVendor);
router.put('/vendors/:id', authenticate, authorize(UserRole.ADMIN), updateVendor);
router.delete('/vendors/:id', authenticate, authorize(UserRole.ADMIN), deleteVendor);

// Booking Management
router.get('/bookings', authenticate, authorize(UserRole.ADMIN), getAllBookings);
router.put('/bookings/:id', authenticate, authorize(UserRole.ADMIN), updateBooking);
router.delete('/bookings/:id', authenticate, authorize(UserRole.ADMIN), deleteBooking);

// Review Management
router.get('/reviews', authenticate, authorize(UserRole.ADMIN), getAllReviews);
router.delete('/reviews/:id', authenticate, authorize(UserRole.ADMIN), deleteReview);

// Analytics
router.get('/analytics', authenticate, authorize(UserRole.ADMIN), getAnalytics);

export default router;
