import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { connectDatabase } from './config/database';
import { errorHandler } from './middleware';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: config.frontend.url,
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

import { trackVisit } from './middleware/trackVisit.middleware';
app.use(trackVisit);

// Health check
app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

import authRoutes from './routes/auth.routes';
import vendorRoutes from './routes/vendor.routes';
import bookingRoutes from './routes/booking.routes';
import userRoutes from './routes/user.routes';
import reviewRoutes from './routes/review.routes';
import paymentRoutes from './routes/payment.routes';
import adminRoutes from './routes/admin.routes';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        await connectDatabase();

        app.listen(config.port, () => {
            console.log(`🚀 Server running on port ${config.port}`);
            console.log(`📝 Environment: ${config.nodeEnv}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Export app for Vercel
export default app;

// Start server only if run directly (not imported)
if (require.main === module) {
    startServer();
}
