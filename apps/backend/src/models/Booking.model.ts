import mongoose, { Schema, Document } from 'mongoose';
import { Booking as IBooking, BookingStatus, EventCategory } from '@event-planner/shared';

export interface BookingDocument extends Omit<IBooking, '_id'>, Document { }

const bookingSchema = new Schema<BookingDocument>(
    {
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
        packageId: {
            type: String,
            required: true,
        },
        eventDate: {
            type: Date,
            required: true,
            index: true,
        },
        eventCategory: {
            type: String,
            enum: Object.values(EventCategory),
            required: true,
        },
        eventDetails: {
            venue: { type: String },
            guestCount: { type: Number },
            specialRequests: { type: String },
        },
        customerDetails: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
        },
        pricing: {
            packagePrice: { type: Number, required: true },
            advanceAmount: { type: Number, required: true },
            remainingAmount: { type: Number, required: true },
            totalAmount: { type: Number, required: true },
        },
        status: {
            type: String,
            enum: Object.values(BookingStatus),
            default: BookingStatus.PENDING,
            index: true,
        },
        paymentId: {
            type: String,
            ref: 'Payment',
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for vendor's bookings on specific dates
bookingSchema.index({ vendorId: 1, eventDate: 1 });

export const BookingModel = mongoose.model<BookingDocument>('Booking', bookingSchema);
