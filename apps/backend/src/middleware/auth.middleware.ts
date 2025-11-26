import { Request, Response, NextFunction } from 'express';
import { firebaseAuth } from '../config/firebase';
import { UserModel } from '../models';
import { AuthTokenPayload } from '@event-planner/shared';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface AuthRequest extends Request {
    user?: AuthTokenPayload;
}

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, error: 'No token provided' });
            return;
        }

        const token = authHeader.split(' ')[1];

        // Verify Firebase ID token
        const decodedToken = await firebaseAuth.verifyIdToken(token);

        // Get user from database to ensure we have the role
        const user = await UserModel.findOne({ firebaseUid: decodedToken.uid });

        // Attach user info to request
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            role: user?.role || 'user',
            ...decodedToken
        } as any;

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
};

export const requireRole = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ success: false, error: 'Not authenticated' });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({ success: false, error: 'Insufficient permissions' });
            return;
        }

        next();
    };
};
