import { BookingStatus, PaymentStatus } from './common.types';

export interface Booking {
    _id?: string;
    user: string; // User ID
    vendor: string; // Vendor ID
    packageId: string; // Package ID from vendor's packages
    date: Date;
    guestCount: number;
    totalAmount: number;
    status: BookingStatus;
    paymentStatus: PaymentStatus;
    paymentId?: string; // Razorpay Payment ID
    orderId?: string; // Razorpay Order ID
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateBookingDto {
    vendorId: string;
    packageId: string;
    date: string; // ISO date string
    guestCount: number;
    amount: number;
}
