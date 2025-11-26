import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@event-planner/shared';

interface AuthenticatedRequest extends Request {
    user?: {
        uid: string;
        role: UserRole;
        [key: string]: any;
    };
}

/**
 * Middleware to authorize users based on their roles
 * @param roles - Array of allowed roles
 */
export const authorize = (...roles: UserRole[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                error: 'Insufficient permissions'
            });
            return;
        }

        next();
    };
};
