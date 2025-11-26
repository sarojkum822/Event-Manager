import mongoose, { Schema, Document } from 'mongoose';

export interface VisitDocument extends Document {
    ipHash: string;
    userId?: string;
    path: string;
    userAgent?: string;
    timestamp: Date;
}

const visitSchema = new Schema<VisitDocument>(
    {
        ipHash: {
            type: String,
            required: true,
            index: true,
        },
        userId: {
            type: String,
            index: true,
        },
        path: {
            type: String,
            required: true,
        },
        userAgent: {
            type: String,
        },
        timestamp: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    {
        timestamps: false, // We use our own timestamp field
        expireAfterSeconds: 60 * 60 * 24 * 90, // Auto-delete after 90 days to manage data size
    }
);

// Index for analytics queries
visitSchema.index({ timestamp: 1 });
visitSchema.index({ ipHash: 1, timestamp: 1 });

export const VisitModel = mongoose.model<VisitDocument>('Visit', visitSchema);
