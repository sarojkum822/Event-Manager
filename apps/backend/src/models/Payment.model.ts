import mongoose, { Schema, Document } from 'mongoose';
import { Payment as IPayment, PaymentStatus } from '@event-planner/shared';

export interface PaymentDocument extends Omit<IPayment, '_id'>, Document { }

const paymentSchema = new Schema<PaymentDocument>(
    {
        bookingId: {
            type: String,
            required: true,
            ref: 'Booking',
            index: true,
        },
        customerId: {
            type: String,
            required: true,
            ref: 'User',
            index: true,
        },
        vendorId: {
            type: String,
            required: true,
            ref: 'Vendor',
            index: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: 'INR',
        },
        razorpayOrderId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        razorpayPaymentId: {
            type: String,
            index: true,
        },
        razorpaySignature: {
            type: String,
        },
        status: {
            type: String,
            enum: Object.values(PaymentStatus),
            default: PaymentStatus.PENDING,
            index: true,
        },
        paymentType: {
            type: String,
            enum: ['advance', 'full', 'remaining'],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const PaymentModel = mongoose.model<PaymentDocument>('Payment', paymentSchema);
