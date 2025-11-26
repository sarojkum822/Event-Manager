import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Validate request body against Zod schema
 */
export const validateBody = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            schema.parse(req.body);
            next();
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: 'Validation error',
                details: error.errors,
            });
        }
    };
};

/**
 * Validate request query parameters against Zod schema
 */
export const validateQuery = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            schema.parse(req.query);
            next();
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: 'Query validation error',
                details: error.errors,
            });
        }
    };
};

/**
 * Validate request path parameters against Zod schema
 */
export const validateParams = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            schema.parse(req.params);
            next();
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: 'Path parameter validation error',
                details: error.errors,
            });
        }
    };
};

// Backward compatibility
export const validate = validateBody;
