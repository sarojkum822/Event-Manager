import { Router, Request, Response } from 'express';
import { firebaseAuth } from '../config/firebase';
import { UserModel } from '../models';
import { config } from '../config';
import jwt from 'jsonwebtoken';
import { UserRole } from '@event-planner/shared';

const router = Router();

// Login/Register with Firebase Token
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        if (!token) {
            res.status(400).json({ success: false, error: 'Token is required' });
            return;
        }

        // Verify Firebase token
        const decodedToken = await firebaseAuth.verifyIdToken(token);
        const { uid, email, phone_number, picture, name } = decodedToken;

        // Check if user exists
        let user = await UserModel.findOne({ firebaseUid: uid });

        const isAdminEmail = email === 'sarojkum822@gmail.com';
        const targetRole = isAdminEmail ? UserRole.ADMIN : UserRole.CUSTOMER;

        if (!user) {
            // Create new user
            user = await UserModel.create({
                firebaseUid: uid,
                email: email,
                phone: phone_number || undefined,
                name: name || email?.split('@')[0] || 'User',
                role: targetRole,
                avatar: picture,
                isEmailVerified: decodedToken.email_verified || false,
                isPhoneVerified: !!phone_number,
            });
        } else if (isAdminEmail && user.role !== UserRole.ADMIN) {
            // Upgrade existing user to admin if email matches
            user.role = UserRole.ADMIN;
            await user.save();
        }

        // Generate Backend JWT
        const authToken = jwt.sign(
            {
                userId: user._id,
                firebaseUid: user.firebaseUid,
                role: user.role,
                email: user.email,
                phone: user.phone,
            },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn as any }
        );

        res.status(200).json({
            success: true,
            data: {
                token: authToken,
                user,
            },
        });
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(401).json({ success: false, error: 'Invalid token or authentication failed' });
    }
});

export const authRoutes = router;
export default router;
