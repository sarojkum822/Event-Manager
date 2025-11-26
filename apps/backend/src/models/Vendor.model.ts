import mongoose, { Schema, Document } from 'mongoose';
import { Vendor as IVendor, EventCategory, VendorStatus, Package, Availability } from '@event-planner/shared';

export interface VendorDocument extends Omit<IVendor, '_id'>, Document { }

const packageSchema = new Schema<Package>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
});

const availabilitySchema = new Schema<Availability>({
    date: { type: Date, required: true },
    isAvailable: { type: Boolean, required: true },
    slots: [{ type: String }],
});

const vendorSchema = new Schema<VendorDocument>(
    {
        userId: {
            type: String,
            required: true,
            ref: 'User',
            unique: true,
            index: true,
        },
        businessName: {
            type: String,
            required: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
        },
        categories: [{
            type: String,
            enum: Object.values(EventCategory),
            required: true,
        }],
        address: {
            street: { type: String, required: true },
            city: { type: String, required: true, index: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            country: { type: String, required: true },
            coordinates: {
                lat: { type: Number },
                lng: { type: Number },
            },
        },
        serviceAreas: [{
            type: String,
            required: true,
        }],
        packages: [packageSchema],
        gallery: [{ type: String }],
        availability: [availabilitySchema],
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: Object.values(VendorStatus),
            default: VendorStatus.PENDING,
        },
        documents: {
            businessLicense: { type: String },
            taxId: { type: String },
            insurance: { type: String },
        },
        bankDetails: {
            accountNumber: { type: String },
            ifscCode: { type: String },
            accountHolderName: { type: String },
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for search
vendorSchema.index({ 'address.city': 1, rating: -1 });

export const VendorModel = mongoose.model<VendorDocument>('Vendor', vendorSchema);
export default VendorModel;
