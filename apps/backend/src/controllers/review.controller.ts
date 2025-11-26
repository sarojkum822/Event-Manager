import { Request, Response } from 'express';
import { ReviewModel } from '../models';
import { UserModel } from '../models';
import Vendor from '../models/Vendor.model';
import Booking from '../models/Booking.model';
import { BookingStatus } from '@event-planner/shared';

interface AuthenticatedRequest extends Request {
    user?: {
        uid: string;
        [key: string]: any;
    };
}

/**
 * Create a review for a completed booking
 */
export const createReview = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.uid;
        const { bookingId, vendorId, rating, comment, images } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Verify user exists
        const user = await UserModel.findOne({ firebaseUid: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify booking exists and is completed
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status !== BookingStatus.COMPLETED) {
            return res.status(400).json({ message: 'Can only review completed bookings' });
        }

        // Check if user owns this booking
        if (booking.user.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to review this booking' });
        }

        // Check if review already exists for this booking
        const existingReview = await ReviewModel.findOne({ bookingId });
        if (existingReview) {
            return res.status(400).json({ message: 'Review already exists for this booking' });
        }

        // Create review
        const review = await ReviewModel.create({
            bookingId,
            customerId: user._id.toString(),
            vendorId,
            rating,
            comment,
            images: images || [],
        });

        // Update vendor's average rating
        await updateVendorRating(vendorId);

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            review,
        });
    } catch (error) {
        console.error('Create Review Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Get all reviews for a vendor
 */
export const getVendorReviews = async (req: Request, res: Response) => {
    try {
        const { vendorId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const reviews = await ReviewModel.find({ vendorId })
            .populate('customerId', 'name avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await ReviewModel.countDocuments({ vendorId });

        res.json({
            reviews,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get Vendor Reviews Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Vendor responds to a review
 */
export const respondToReview = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.uid;
        const { id } = req.params;
        const { text } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Verify user exists and is a vendor
        const user = await UserModel.findOne({ firebaseUid: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find vendor profile
        const vendor = await Vendor.findOne({ userId: user._id });
        if (!vendor) {
            return res.status(403).json({ message: 'Only vendors can respond to reviews' });
        }

        // Find review
        const review = await ReviewModel.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Verify vendor owns this review
        if (review.vendorId !== vendor._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to respond to this review' });
        }

        // Add response
        review.response = {
            text,
            respondedAt: new Date(),
        };

        await review.save();

        res.json({
            success: true,
            message: 'Response added successfully',
            review,
        });
    } catch (error) {
        console.error('Respond to Review Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Update vendor's average rating
 */
const updateVendorRating = async (vendorId: string) => {
    try {
        const reviews = await ReviewModel.find({ vendorId });

        if (reviews.length === 0) {
            return;
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        await Vendor.findByIdAndUpdate(vendorId, {
            rating: parseFloat(averageRating.toFixed(1)),
            reviewCount: reviews.length,
        });
    } catch (error) {
        console.error('Update Vendor Rating Error:', error);
    }
};
