import Booking from '../models/Booking.model';
import { UserModel } from '../models';
import Vendor from '../models/Vendor.model';
import { BookingStatus, PaymentStatus } from '@event-planner/shared';
import { VisitModel } from '../models/Visit.model';

// Helper to calculate percentage change
const calculateGrowth = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
};

// Helper to get start of day
const getStartOfDay = (date: Date = new Date()) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

/**
 * Get booking statistics
 */
export const getBookingStats = async () => {
    const today = getStartOfDay();
    const yesterday = getStartOfDay(new Date(Date.now() - 86400000));

    const [
        totalBookings,
        confirmedBookings,
        pendingBookings,
        completedBookings,
        cancelledBookings,
        todayBookings,
        yesterdayBookings
    ] = await Promise.all([
        Booking.countDocuments(),
        Booking.countDocuments({ status: BookingStatus.CONFIRMED }),
        Booking.countDocuments({ status: BookingStatus.PENDING }),
        Booking.countDocuments({ status: BookingStatus.COMPLETED }),
        Booking.countDocuments({ status: BookingStatus.CANCELLED }),
        Booking.countDocuments({ createdAt: { $gte: today } }),
        Booking.countDocuments({ createdAt: { $gte: yesterday, $lt: today } })
    ]);

    return {
        total: totalBookings,
        confirmed: confirmedBookings,
        pending: pendingBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
        today: todayBookings,
        growth: calculateGrowth(todayBookings, yesterdayBookings)
    };
};

/**
 * Get revenue statistics
 */
export const getRevenueStats = async () => {
    const today = getStartOfDay();
    const yesterday = getStartOfDay(new Date(Date.now() - 86400000));

    const [totalStats, todayStats, yesterdayStats] = await Promise.all([
        // Total Revenue
        Booking.aggregate([
            { $match: { paymentStatus: PaymentStatus.COMPLETED } },
            { $group: { _id: null, total: { $sum: '$totalAmount' }, avg: { $avg: '$totalAmount' }, count: { $sum: 1 } } }
        ]),
        // Today's Revenue
        Booking.aggregate([
            { $match: { paymentStatus: PaymentStatus.COMPLETED, updatedAt: { $gte: today } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]),
        // Yesterday's Revenue
        Booking.aggregate([
            { $match: { paymentStatus: PaymentStatus.COMPLETED, updatedAt: { $gte: yesterday, $lt: today } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ])
    ]);

    const currentRevenue = todayStats[0]?.total || 0;
    const previousRevenue = yesterdayStats[0]?.total || 0;

    return {
        totalRevenue: totalStats[0]?.total || 0,
        averageBookingValue: Math.round(totalStats[0]?.avg || 0),
        completedPayments: totalStats[0]?.count || 0,
        todayRevenue: currentRevenue,
        growth: calculateGrowth(currentRevenue, previousRevenue)
    };
};

/**
 * Get user statistics
 */
export const getUserStats = async () => {
    const today = getStartOfDay();
    const yesterday = getStartOfDay(new Date(Date.now() - 86400000));

    const [totalUsers, verifiedUsers, todayUsers, yesterdayUsers] = await Promise.all([
        UserModel.countDocuments(),
        UserModel.countDocuments({ isEmailVerified: true }),
        UserModel.countDocuments({ createdAt: { $gte: today } }),
        UserModel.countDocuments({ createdAt: { $gte: yesterday, $lt: today } })
    ]);

    return {
        total: totalUsers,
        verified: verifiedUsers,
        today: todayUsers,
        growth: calculateGrowth(todayUsers, yesterdayUsers)
    };
};

/**
 * Get vendor statistics
 */
export const getVendorStats = async () => {
    const today = getStartOfDay();
    const yesterday = getStartOfDay(new Date(Date.now() - 86400000));

    const [totalVendors, verifiedVendors, pendingVendors, rejectedVendors, todayVendors, yesterdayVendors] = await Promise.all([
        Vendor.countDocuments(),
        Vendor.countDocuments({ status: 'verified' }),
        Vendor.countDocuments({ status: 'pending' }),
        Vendor.countDocuments({ status: 'rejected' }),
        Vendor.countDocuments({ createdAt: { $gte: today } }),
        Vendor.countDocuments({ createdAt: { $gte: yesterday, $lt: today } })
    ]);

    return {
        total: totalVendors,
        verified: verifiedVendors,
        pending: pendingVendors,
        rejected: rejectedVendors,
        today: todayVendors,
        growth: calculateGrowth(todayVendors, yesterdayVendors)
    };
};

/**
 * Get traffic statistics
 */
export const getTrafficStats = async () => {
    const totalVisits = await VisitModel.countDocuments();
    const uniqueVisitors = (await VisitModel.distinct('ipHash')).length;

    // Daily visits for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const dailyVisits = await VisitModel.aggregate([
        { $match: { timestamp: { $gte: thirtyDaysAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                count: { $sum: 1 },
                unique: { $addToSet: "$ipHash" }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    return {
        totalVisits,
        uniqueVisitors,
        dailyVisits: dailyVisits.map(d => ({
            date: d._id,
            count: d.count,
            uniqueCount: d.unique.length
        }))
    };
};

/**
 * Get chart data for last 7 days
 */
export const getChartData = async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Sales Overview (Revenue)
    const salesData = await Booking.aggregate([
        { $match: { paymentStatus: PaymentStatus.COMPLETED, updatedAt: { $gte: sevenDaysAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
                sales: { $sum: '$totalAmount' }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Active Users (Visits)
    const trafficData = await VisitModel.aggregate([
        { $match: { timestamp: { $gte: sevenDaysAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                users: { $addToSet: "$ipHash" } // Count unique IPs as active users
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Merge and fill missing days
    const chartData = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toISOString().split('T')[0];

        const sales = salesData.find(s => s._id === dateStr)?.sales || 0;
        const users = trafficData.find(t => t._id === dateStr)?.users.length || 0;

        chartData.push({
            date: dateStr,
            sales,
            users
        });
    }

    return chartData;
};

/**
 * Get comprehensive platform analytics
 */
export const getPlatformAnalytics = async () => {
    const [bookings, revenue, users, vendors, traffic, chartData, recentVendors, recentBookings] = await Promise.all([
        getBookingStats(),
        getRevenueStats(),
        getUserStats(),
        getVendorStats(),
        getTrafficStats(),
        getChartData(),
        Vendor.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name email'),
        Booking.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name').populate('vendor', 'businessName')
    ]);

    return {
        bookings,
        revenue,
        users,
        vendors,
        traffic,
        chartData,
        recentVendors,
        recentBookings,
        // Legacy support
        totalUsers: users.total,
        totalVendors: vendors.total,
        totalBookings: bookings.total,
        totalRevenue: revenue.totalRevenue,
    };
};
