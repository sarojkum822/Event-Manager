import { PaymentStatus } from './common.types';

export interface Payment {
    _id: string;
    bookingId: string;
    customerId: string;
    vendorId: string;
    amount: number;
    currency: string;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    status: PaymentStatus;
    paymentType: 'advance' | 'full' | 'remaining';
    createdAt: Date;
    updatedAt: Date;
}

export interface CreatePaymentDto {
    bookingId: string;
    amount: number;
    paymentType: 'advance' | 'full' | 'remaining';
}

export interface RazorpayOrderResponse {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
}

export interface VerifyPaymentDto {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}

export interface RazorpayWebhookPayload {
    entity: string;
    account_id: string;
    event: string;
    contains: string[];
    payload: {
        payment: {
            entity: any;
        };
        order?: {
            entity: any;
        };
    };
    created_at: number;
}
