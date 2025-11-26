import { Request, Response } from 'express';
import Vendor from '../models/Vendor.model';
import { UserModel } from '../models';
import { uploadMultipleImages } from '../services/cloudinary.service';
import { UserRole } from '@event-planner/shared';

interface AuthenticatedRequest extends Request {
    user?: {
        uid: string;
        role: UserRole;
        [key: string]: any;
    };
}

export const getVendorById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const vendor = await Vendor.findById(id);

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        res.json(vendor);
    } catch (error) {
        console.error('Get Vendor Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const searchVendors = async (req: Request, res: Response) => {
    try {
        const { city, category } = req.query;
        const query: any = { status: 'verified' };

        if (city) {
            query['address.city'] = new RegExp(city as string, 'i');
        }

        if (category) {
            query.categories = category;
        }

        const vendors = await Vendor.find(query);
        res.json(vendors);
    } catch (error) {
        console.error('Search Vendors Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Create vendor profile
 */
export const createVendorProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.uid;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Find user
        const user = await UserModel.findOne({ firebaseUid: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if vendor profile already exists
        const existingVendor = await Vendor.findOne({ userId: user._id });
        if (existingVendor) {
            return res.status(400).json({ message: 'Vendor profile already exists' });
        }

        // Create vendor profile
        const vendorData = {
            ...req.body,
            userId: user._id,
            status: 'pending', // Requires admin verification
        };

        const vendor = await Vendor.create(vendorData);

        // Update user role to vendor
        user.role = UserRole.VENDOR;
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Vendor profile created successfully. Pending admin verification.',
            vendor,
        });
    } catch (error) {
        console.error('Create Vendor Profile Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Update vendor profile
 */
export const updateVendorProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.uid;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Find user
        const user = await UserModel.findOne({ firebaseUid: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find vendor
        const vendor = await Vendor.findById(id);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Verify ownership
        if (vendor.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this vendor profile' });
        }

        // Update vendor
        const allowedUpdates = [
            'businessName',
            'description',
            'categories',
            'address',
            'phone',
            'email',
            'website',
            'packages',
            'availability',
            'policies',
        ];

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                (vendor as any)[field] = req.body[field];
            }
        });

        await vendor.save();

        res.json({
            success: true,
            message: 'Vendor profile updated successfully',
            vendor,
        });
    } catch (error) {
        console.error('Update Vendor Profile Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Get authenticated vendor's profile
 */
export const getMyVendorProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.uid;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Find user
        const user = await UserModel.findOne({ firebaseUid: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find vendor profile
        const vendor = await Vendor.findOne({ userId: user._id });
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor profile not found' });
        }

        res.json(vendor);
    } catch (error) {
        console.error('Get My Vendor Profile Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Upload vendor gallery images
 */
export const uploadVendorImages = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.uid;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // Find user
        const user = await UserModel.findOne({ firebaseUid: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find vendor profile
        const vendor = await Vendor.findOne({ userId: user._id });
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor profile not found' });
        }

        // Upload images to Cloudinary
        const uploadResults = await uploadMultipleImages(
            req.files as Express.Multer.File[],
            'event-planner/vendors'
        );

        // Add URLs to vendor gallery
        const imageUrls = uploadResults.map((result) => result.url);
        vendor.gallery = [...vendor.gallery, ...imageUrls];

        await vendor.save();

        res.json({
            success: true,
            message: 'Images uploaded successfully',
            images: imageUrls,
            gallery: vendor.gallery,
        });
    } catch (error) {
        console.error('Upload Vendor Images Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

