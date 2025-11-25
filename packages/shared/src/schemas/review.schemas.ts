import { z } from 'zod';

export const createReviewSchema = z.object({
    bookingId: z.string().min(1),
    vendorId: z.string().min(1),
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(10).max(1000),
    images: z.array(z.string().url()).max(5).optional(),
});

export const updateReviewSchema = z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().min(10).max(1000).optional(),
    images: z.array(z.string().url()).max(5).optional(),
});

export const vendorResponseSchema = z.object({
    reviewId: z.string().min(1),
    response: z.string().min(10).max(500),
});
