import { z } from 'zod';

export const createPaymentSchema = z.object({
    bookingId: z.string().min(1),
    amount: z.number().positive(),
    paymentType: z.enum(['advance', 'full', 'remaining']),
});

export const verifyPaymentSchema = z.object({
    razorpayOrderId: z.string().min(1),
    razorpayPaymentId: z.string().min(1),
    razorpaySignature: z.string().min(1),
});
