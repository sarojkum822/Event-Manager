import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { VisitModel } from '../models/Visit.model';

// Helper to hash IP for privacy
const hashIp = (ip: string): string => {
    return crypto.createHash('sha256').update(ip).digest('hex');
};

export const trackVisit = async (req: Request, res: Response, next: NextFunction) => {
    // Only track GET requests
    if (req.method !== 'GET') {
        return next();
    }

    // Skip static files, health checks, and internal API calls if needed
    if (req.path.startsWith('/_next') || req.path.startsWith('/static') || req.path === '/health') {
        return next();
    }

    try {
        const ip = req.ip || req.socket.remoteAddress || 'unknown';
        const userAgent = req.headers['user-agent'];

        // Check if user is authenticated (if auth middleware ran before this)
        const userId = (req as any).user?.uid;

        // Run asynchronously to not block the request
        VisitModel.create({
            ipHash: hashIp(ip),
            userId,
            path: req.path,
            userAgent,
            timestamp: new Date(),
        }).catch(err => {
            console.error('Error tracking visit:', err);
        });

    } catch (error) {
        console.error('Error in trackVisit middleware:', error);
    }

    next();
};
