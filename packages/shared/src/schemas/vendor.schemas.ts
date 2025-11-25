import { z } from 'zod';
import { EventCategory } from '../types';

const addressSchema = z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(5).max(10),
    country: z.string().min(1),
    coordinates: z.object({
        lat: z.number(),
        lng: z.number(),
    }).optional(),
});

export const createVendorSchema = z.object({
    userId: z.string().min(1),
    businessName: z.string().min(2).max(200),
    description: z.string().min(10).max(2000),
    categories: z.array(z.nativeEnum(EventCategory)).min(1),
    address: addressSchema,
    serviceAreas: z.array(z.string()).min(1),
});

export const updateVendorSchema = z.object({
    businessName: z.string().min(2).max(200).optional(),
    description: z.string().min(10).max(2000).optional(),
    categories: z.array(z.nativeEnum(EventCategory)).min(1).optional(),
    address: addressSchema.optional(),
    serviceAreas: z.array(z.string()).min(1).optional(),
});

export const createPackageSchema = z.object({
    name: z.string().min(2).max(200),
    description: z.string().min(10).max(1000),
    price: z.number().positive(),
    duration: z.string().optional(),
    features: z.array(z.string()).min(1),
});

export const updatePackageSchema = z.object({
    name: z.string().min(2).max(200).optional(),
    description: z.string().min(10).max(1000).optional(),
    price: z.number().positive().optional(),
    duration: z.string().optional(),
    features: z.array(z.string()).min(1).optional(),
    isActive: z.boolean().optional(),
});

export const searchVendorsSchema = z.object({
    city: z.string().optional(),
    category: z.nativeEnum(EventCategory).optional(),
    date: z.string().datetime().optional(),
    minRating: z.number().min(0).max(5).optional(),
    minPrice: z.number().min(0).optional(),
    maxPrice: z.number().positive().optional(),
    page: z.number().int().positive().optional(),
    limit: z.number().int().positive().max(100).optional(),
});
