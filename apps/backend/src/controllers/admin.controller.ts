import { Request, Response } from 'express';
import Vendor from '../models/Vendor.model';
import Booking from '../models/Booking.model';
import { UserModel } from '../models';
import { ReviewModel as Review } from '../models/Review.model';
import { getPlatformAnalytics } from '../services/analytics.service';

interface AuthenticatedRequest extends Request {
    user?: {
        uid: string;
        [key: string]: any;
    };
}

// --- User Management ---

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { role, search, page = 1, limit = 20 } = req.query;
        const query: any = {};

        if (role) query.role = role;
        if (search) {
            query.$or = [
                { name: new RegExp(search as string, 'i') },
                { email: new RegExp(search as string, 'i') }
            ];
        }

        const users = await UserModel.find(query)
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await UserModel.countDocuments(query);

        res.json({
            users,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        console.error('Get All Users Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { role, isActive } = req.body;
        const user = await UserModel.findByIdAndUpdate(
            req.params.id,
            { role, isActive },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ success: true, message: 'User updated', user });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Also delete associated vendor profile if exists
        await Vendor.findOneAndDelete({ userId: user._id });

        res.json({ success: true, message: 'User and associated data deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// --- Vendor Management ---

export const getAllVendors = async (req: Request, res: Response) => {
    try {
        const { status, search, page = 1, limit = 20 } = req.query;
        const query: any = {};

        if (status) query.status = status;
        if (search) {
            query.businessName = new RegExp(search as string, 'i');
        }

        const vendors = await Vendor.find(query)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await Vendor.countDocuments(query);

        res.json({
            vendors,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getPendingVendors = async (req: Request, res: Response) => {
    try {
        const vendors = await Vendor.find({ status: 'pending' })
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 });
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const verifyVendor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;

        if (!['verified', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const vendor = await Vendor.findById(id);
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

        vendor.status = status;
        if (status === 'rejected' && rejectionReason) {
            (vendor as any).rejectionReason = rejectionReason;
        }

        await vendor.save();
        res.json({ success: true, message: `Vendor ${status}`, vendor });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateVendor = async (req: Request, res: Response) => {
    try {
        const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
        res.json({ success: true, message: 'Vendor updated', vendor });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteVendor = async (req: Request, res: Response) => {
    try {
        const vendor = await Vendor.findByIdAndDelete(req.params.id);
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

        // Reset user role to user
        await UserModel.findByIdAndUpdate(vendor.userId, { role: 'user' });

        res.json({ success: true, message: 'Vendor deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// --- Booking Management ---

export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const query: any = {};

        if (status) query.status = status;

        const bookings = await Booking.find(query)
            .populate('user', 'name email phone')
            .populate('vendor', 'businessName address')
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await Booking.countDocuments(query);

        res.json({
            bookings,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateBooking = async (req: Request, res: Response) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json({ success: true, message: 'Booking updated', booking });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteBooking = async (req: Request, res: Response) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json({ success: true, message: 'Booking deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// --- Review Management ---

export const getAllReviews = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const reviews = await Review.find()
            .populate('userId', 'name')
            .populate('vendorId', 'businessName')
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await Review.countDocuments();

        res.json({
            reviews,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteReview = async (req: Request, res: Response) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.json({ success: true, message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// --- Analytics ---

export const getAnalytics = async (req: Request, res: Response) => {
    try {
        const analytics = await getPlatformAnalytics();
        res.json(analytics);
    } catch (error) {
        console.error('Get Analytics Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
