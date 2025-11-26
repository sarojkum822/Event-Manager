import { z } from 'zod';

/**
 * Validation schemas for API requests
 */

// User schemas
export const updateProfileSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
});

// Vendor schemas
export const createVendorSchema = z.object({
    businessName: z.string().min(3).max(200),
    description: z.string().min(10).max(2000),
    categories: z.array(z.string()).min(1),
    address: z.object({
        street: z.string().min(5),
        city: z.string().min(2),
        state: z.string().min(2),
        pincode: z.string().regex(/^\d{6}$/),
        country: z.string().min(2),
    }),
    serviceAreas: z.array(z.string()).min(1),
    packages: z.array(z.object({
        name: z.string().min(3),
        description: z.string().min(10),
        price: z.number().positive(),
        duration: z.string().optional(),
        features: z.array(z.string()).optional(),
    })).optional(),
});

export const updateVendorSchema = createVendorSchema.partial();

// Booking schemas
export const createBookingSchema = z.object({
    vendorId: z.string().min(1),
    packageId: z.string().optional(),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
    }),
    guestCount: z.number().int().positive(),
    amount: z.number().positive(),
});

export const verifyPaymentSchema = z.object({
    razorpay_order_id: z.string().min(1),
    razorpay_payment_id: z.string().min(1),
    razorpay_signature: z.string().min(1),
});

// Review schemas
export const createReviewSchema = z.object({
    bookingId: z.string().min(1),
    vendorId: z.string().min(1),
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(10).max(1000),
    images: z.array(z.string().url()).optional(),
});

export const respondToReviewSchema = z.object({
    text: z.string().min(10).max(500),
});

// Admin schemas
export const verifyVendorSchema = z.object({
    status: z.enum(['verified', 'rejected']),
    rejectionReason: z.string().min(10).max(500).optional(),
});

// Query parameter schemas
export const paginationSchema = z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export const searchVendorsSchema = z.object({
    city: z.string().optional(),
    category: z.string().optional(),
});

export const bookingFilterSchema = z.object({
    status: z.string().optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

// ID parameter schema
export const idParamSchema = z.object({
    id: z.string().min(1),
});
