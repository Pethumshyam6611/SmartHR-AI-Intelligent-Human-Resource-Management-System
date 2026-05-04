import { Router } from 'express';
// Controllers will be implemented later
import * as authController from '../controllers/auth.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// POST /api/auth/invite - Protected route for ADMIN/HR_MANAGER only
router.post('/invite', authenticate, authorize('ADMIN', 'HR_MANAGER'), authController.inviteUser);

// POST /api/auth/register - Public route
router.post('/register', authController.registerUser);

// POST /api/auth/forgot-password - Public route
router.post('/forgot-password', authController.requestPasswordReset);

// POST /api/auth/reset-password - Public route
router.post('/reset-password', authController.resetPassword);

// PUT /api/auth/profile - Protected route for authenticated users
router.put('/profile', authenticate, authController.updateProfile);

// POST /api/auth/login - Public route
router.post('/login', authController.login);

// POST /api/auth/refresh-token
// router.post('/refresh-token', authController.refreshToken);

export default router;
