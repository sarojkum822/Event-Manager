import express from 'express';
// import request from 'supertest';

/**
 * Test utilities for backend API testing
 */

/**
 * Create a test Express app with routes
 */
export const createTestApp = () => {
    const app = express();
    app.use(express.json());
    return app;
};

/**
 * Mock authentication middleware for testing
 */
export const mockAuth = (userId: string, role: string = 'CUSTOMER') => {
    return (req: any, res: any, next: any) => {
        req.user = {
            uid: userId,
            role,
        };
        next();
    };
};

/**
 * Generate mock Firebase token
 */
export const generateMockFirebaseToken = () => {
    return 'mock-firebase-token-' + Date.now();
};

/**
 * Generate mock JWT token
 */
export const generateMockJWT = () => {
    return 'mock-jwt-token-' + Date.now();
};

/**
 * Mock user data
 */
export const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    firebaseUid: 'mock-firebase-uid',
    email: 'test@example.com',
    name: 'Test User',
    role: 'CUSTOMER',
    isEmailVerified: true,
};

/**
 * Mock vendor data
 */
export const mockVendor = {
    _id: '507f1f77bcf86cd799439012',
    userId: '507f1f77bcf86cd799439011',
    businessName: 'Test Vendor',
    description: 'Test vendor description',
    categories: ['WEDDING'],
    address: {
        street: '123 Test St',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India',
    },
    serviceAreas: ['Mumbai'],
    rating: 4.5,
    reviewCount: 10,
    status: 'verified',
};

/**
 * Mock booking data
 */
export const mockBooking = {
    _id: '507f1f77bcf86cd799439013',
    user: '507f1f77bcf86cd799439011',
    vendor: '507f1f77bcf86cd799439012',
    date: new Date('2024-12-25'),
    guestCount: 150,
    totalAmount: 50000,
    status: 'CONFIRMED',
    paymentStatus: 'COMPLETED',
};

/**
 * Test helper to make authenticated requests
 */
export const authenticatedRequest = (app: express.Application, token: string) => {
    return {
        // get: (url: string) => request(app).get(url).set('Authorization', `Bearer ${token}`),
        // post: (url: string) => request(app).post(url).set('Authorization', `Bearer ${token}`),
        // put: (url: string) => request(app).put(url).set('Authorization', `Bearer ${token}`),
        // delete: (url: string) => request(app).delete(url).set('Authorization', `Bearer ${token}`),
    };
};

/**
 * Wait for async operations
 */
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Clean up test database
 */
export const cleanupTestData = async (models: any[]) => {
    for (const model of models) {
        await model.deleteMany({});
    }
};
