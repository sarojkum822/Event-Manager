import { z } from 'zod';
import { UserRole } from '../types';

export const createUserSchema = z.object({
    firebaseUid: z.string().min(1),
    email: z.string().email().optional(),
    phone: z.string().min(10).max(15),
    name: z.string().min(2).max(100),
    role: z.nativeEnum(UserRole),
});

export const updateUserSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    avatar: z.string().url().optional(),
});
