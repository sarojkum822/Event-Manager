import { z } from 'zod';
import { EventCategory, BookingStatus } from '../types';

export const createBookingSchema = z.object({
    vendorId: z.string().min(1),
    packageId: z.string().min(1),
    eventDate: z.string().datetime(),
    eventCategory: z.nativeEnum(EventCategory),
    eventDetails: z.object({
        venue: z.string().optional(),
        guestCount: z.number().int().positive().optional(),
        specialRequests: z.string().max(1000).optional(),
    }),
    customerDetails: z.object({
        name: z.string().min(2).max(100),
        email: z.string().email(),
        phone: z.string().min(10).max(15),
    }),
    paymentType: z.enum(['advance', 'full']),
});

export const updateBookingSchema = z.object({
    status: z.nativeEnum(BookingStatus).optional(),
    eventDetails: z.object({
        venue: z.string().optional(),
        guestCount: z.number().int().positive().optional(),
        specialRequests: z.string().max(1000).optional(),
    }).optional(),
});
