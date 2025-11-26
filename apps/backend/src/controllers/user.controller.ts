import { Request, Response } from 'express';
import { UserModel } from '../models';
import { uploadImage } from '../services/cloudinary.service';

interface AuthenticatedRequest extends Request {
    user?: {
        uid: string;
        [key: string]: any;
    };
}

/**
 * Get authenticated user's profile
 */
export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.uid;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await UserModel.findOne({ firebaseUid: userId }).select('-__v');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.uid;
        const { name, phone } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await UserModel.findOne({ firebaseUid: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (phone) user.phone = phone;

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user,
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Upload user avatar
 */
export const uploadAvatar = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.uid;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await UserModel.findOne({ firebaseUid: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Upload to Cloudinary
        const { url } = await uploadImage(req.file.buffer, 'event-planner/avatars');

        // Update user avatar
        user.avatar = url;
        await user.save();

        res.json({
            success: true,
            message: 'Avatar uploaded successfully',
            avatar: url,
        });
    } catch (error) {
        console.error('Upload Avatar Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
