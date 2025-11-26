import mongoose, { Schema, Document } from 'mongoose';
import { Booking, BookingStatus, PaymentStatus } from '@event-planner/shared';

export interface IBookingDocument extends Omit<Booking, '_id'>, Document { }

const BookingSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    packageId: { type: String, required: true },
    date: { type: Date, required: true },
    guestCount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: Object.values(BookingStatus),
        default: BookingStatus.PENDING
    },
    paymentStatus: {
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING
    },
    paymentId: { type: String },
    orderId: { type: String }
}, {
    timestamps: true
});

// Index for querying bookings by user or vendor
BookingSchema.index({ user: 1, createdAt: -1 });
BookingSchema.index({ vendor: 1, date: 1 });

export default mongoose.model<IBookingDocument>('Booking', BookingSchema);
