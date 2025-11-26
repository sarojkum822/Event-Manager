import mongoose, { Schema, Document } from 'mongoose';
import { User as IUser, UserRole } from '@event-planner/shared';

export interface UserDocument extends Omit<IUser, '_id'>, Document { }

const userSchema = new Schema<UserDocument>(
    {
        firebaseUid: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
        },
        phone: {
            type: String,
            sparse: true,
            unique: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            required: true,
            default: UserRole.CUSTOMER,
        },
        avatar: {
            type: String,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isPhoneVerified: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
export default UserModel;
