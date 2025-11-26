import { Request, Response } from 'express';
import Booking from '../models/Booking.model';
import Vendor from '../models/Vendor.model';
import User from '../models/User.model';
import { BookingStatus, CreateBookingDto, PaymentStatus } from '@event-planner/shared';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

interface AuthenticatedRequest extends Request {
    user?: {
        uid: string;
        [key: string]: any;
    };
}

export const createBooking = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { vendorId, packageId, date, guestCount, amount } = req.body as CreateBookingDto;
        const userId = req.user?.uid;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Verify vendor exists
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Create Razorpay Order
        const options = {
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            receipt: `booking_${Date.now()}`
        };

        let order;
        try {
            if (process.env.RAZORPAY_KEY_ID) {
                order = await razorpay.orders.create(options);
            } else {
                // Mock order for development if keys are missing
                order = {
                    id: `order_mock_${Date.now()}`,
                    amount: options.amount,
                    currency: 'INR'
                };
            }
        } catch (err) {
            console.error('Razorpay Error:', err);
            return res.status(500).json({ message: 'Payment initialization failed' });
        }

        // Find User ObjectId
        const userDoc = await User.findOne({ firebaseUid: userId });

        if (!userDoc) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        // Create Booking Record
        const booking = new Booking({
            user: userDoc._id,
            vendor: vendorId,
            packageId,
            date: new Date(date),
            guestCount,
            totalAmount: amount,
            status: BookingStatus.PENDING,
            paymentStatus: PaymentStatus.PENDING,
            orderId: order.id
        });

        await booking.save();

        res.status(201).json({
            booking,
            order
        });

    } catch (error: any) {
        console.error('Create Booking Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic || !process.env.RAZORPAY_KEY_ID) { // Allow mock success if no keys
            // Update booking status
            const booking = await Booking.findOne({ orderId: razorpay_order_id });
            if (booking) {
                booking.paymentStatus = PaymentStatus.COMPLETED;
                booking.status = BookingStatus.CONFIRMED;
                booking.paymentId = razorpay_payment_id;
                await booking.save();

                return res.json({ success: true, message: 'Payment verified' });
            } else {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }
        } else {
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Payment Verification Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserBookings = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.uid;
        const userDoc = await User.findOne({ firebaseUid: userId });

        if (!userDoc) {
            return res.status(404).json({ message: 'User not found' });
        }

        const bookings = await Booking.find({ user: userDoc._id })
            .populate('vendor', 'businessName gallery address')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        console.error('Get User Bookings Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getVendorBookings = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.uid;
        const userDoc = await User.findOne({ firebaseUid: userId });

        if (!userDoc) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find vendor profile for this user
        const vendor = await Vendor.findOne({ userId: userDoc._id });

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor profile not found' });
        }

        // Get all bookings for this vendor
        const bookings = await Booking.find({ vendor: vendor._id })
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        console.error('Get Vendor Bookings Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
