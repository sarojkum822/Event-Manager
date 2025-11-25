import { UserRole } from './common.types';

export interface User {
    _id: string;
    firebaseUid: string;
    email?: string;
    phone: string;
    name: string;
    role: UserRole;
    avatar?: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserDto {
    firebaseUid: string;
    email?: string;
    phone: string;
    name: string;
    role: UserRole;
}

export interface UpdateUserDto {
    name?: string;
    avatar?: string;
}

export interface AuthTokenPayload {
    userId: string;
    firebaseUid: string;
    role: UserRole;
    email?: string;
    phone: string;
}
