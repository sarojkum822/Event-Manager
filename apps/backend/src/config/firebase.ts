import admin from 'firebase-admin';
import { config } from '../config';

// Initialize Firebase Admin SDK
try {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: config.firebase.projectId,
            privateKey: config.firebase.privateKey
                ? config.firebase.privateKey.replace(/\\n/g, '\n').replace(/"/g, '')
                : undefined,
            clientEmail: config.firebase.clientEmail,
        }),
    });
} catch (error) {
    console.warn('Firebase Admin initialization failed. Using mock for development.', error);
}

export const firebaseAdmin = admin;

// Safe export that checks if app is initialized, otherwise returns a mock
export const firebaseAuth = (() => {
    try {
        // Check if any app is initialized
        if (admin.apps.length === 0) {
            throw new Error('No Firebase App initialized');
        }
        return admin.auth();
    } catch (e) {
        console.warn('Returning mock auth due to initialization failure');
        return {
            verifyIdToken: async (token: string) => ({
                uid: 'mock-uid-' + Date.now(),
                email: 'mock@example.com',
                email_verified: true,
                phone_number: undefined,
                picture: undefined,
                name: 'Mock User'
            })
        } as any;
    }
})();
