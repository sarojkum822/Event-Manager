import mongoose, { Schema, Document } from 'mongoose';
import { Review as IReview } from '@event-planner/shared';

export interface ReviewDocument extends Omit<IReview, '_id'>, Document { }

const reviewSchema = new Schema<ReviewDocument>(
    {
        bookingId: {
            type: String,
            required: true,
            ref: 'Booking',
            unique: true,
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
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
        images: [{ type: String }],
        response: {
            text: { type: String },
            respondedAt: { type: Date },
        },
        isVerified: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for vendor's reviews
reviewSchema.index({ vendorId: 1, createdAt: -1 });

export const ReviewModel = mongoose.model<ReviewDocument>('Review', reviewSchema);
