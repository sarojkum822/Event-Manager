import { Request, Response } from 'express';
import Booking from '../models/Booking.model';
import { PaymentModel, UserModel } from '../models';
import { PaymentStatus, BookingStatus } from '@event-planner/shared';
import crypto from 'crypto';

interface AuthenticatedRequest extends Request {
    user?: {
        uid: string;
        [key: string]: any;
    };
}

/**
 * Handle Razorpay webhook for payment updates
 */
export const razorpayWebhook = async (req: Request, res: Response) => {
    try {
        const webhookSignature = req.headers['x-razorpay-signature'] as string;
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

        // Verify webhook signature
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (webhookSignature !== expectedSignature && process.env.RAZORPAY_WEBHOOK_SECRET) {
            return res.status(400).json({ message: 'Invalid signature' });
        }

        const event = req.body.event;
        const payload = req.body.payload.payment.entity;

        // Handle payment success
        if (event === 'payment.captured') {
            const orderId = payload.order_id;
            const paymentId = payload.id;

            // Update booking
            const booking = await Booking.findOne({ orderId });
            if (booking) {
                booking.paymentStatus = PaymentStatus.COMPLETED;
                booking.status = BookingStatus.CONFIRMED;
                booking.paymentId = paymentId;
                await booking.save();

                // Create payment record
                await PaymentModel.create({
                    bookingId: booking._id.toString(),
                    customerId: booking.user.toString(),
                    vendorId: booking.vendor.toString(),
                    amount: payload.amount / 100, // Convert from paise
                    currency: payload.currency,
                    razorpayOrderId: orderId,
                    razorpayPaymentId: paymentId,
                    status: PaymentStatus.COMPLETED,
                    paymentType: 'full',
                });
            }
        }

        // Handle payment failure
        if (event === 'payment.failed') {
            const orderId = payload.order_id;

            const booking = await Booking.findOne({ orderId });
            if (booking) {
                booking.paymentStatus = PaymentStatus.FAILED;
                booking.status = BookingStatus.CANCELLED;
                await booking.save();
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Razorpay Webhook Error:', error);
        res.status(500).json({ message: 'Webhook processing failed' });
    }
};

/**
 * Get payment history for authenticated user
 */
export const getPaymentHistory = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.uid;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await UserModel.findOne({ firebaseUid: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const payments = await PaymentModel.find({ customerId: user._id.toString() })
            .populate('bookingId', 'date guestCount')
            .populate('vendorId', 'businessName')
            .sort({ createdAt: -1 });

        res.json(payments);
    } catch (error) {
        console.error('Get Payment History Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
