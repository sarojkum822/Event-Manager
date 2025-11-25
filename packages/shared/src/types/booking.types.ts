import { BookingStatus, EventCategory } from './common.types';

export interface Booking {
    _id: string;
    customerId: string;
    vendorId: string;
    packageId: string;
    eventDate: Date;
    eventCategory: EventCategory;
    eventDetails: {
        venue?: string;
        guestCount?: number;
        specialRequests?: string;
    };
    customerDetails: {
        name: string;
        email: string;
        phone: string;
    };
    pricing: {
        packagePrice: number;
        advanceAmount: number;
        remainingAmount: number;
        totalAmount: number;
    };
    status: BookingStatus;
    paymentId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateBookingDto {
    vendorId: string;
    packageId: string;
    eventDate: Date;
    eventCategory: EventCategory;
    eventDetails: {
        venue?: string;
        guestCount?: number;
        specialRequests?: string;
    };
    customerDetails: {
        name: string;
        email: string;
        phone: string;
    };
    paymentType: 'advance' | 'full';
}

export interface UpdateBookingDto {
    status?: BookingStatus;
    eventDetails?: {
        venue?: string;
        guestCount?: number;
        specialRequests?: string;
    };
}
