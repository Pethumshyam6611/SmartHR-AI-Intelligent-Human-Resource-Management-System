import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
// Controllers will be implemented later

const router = Router();

router.use(authenticate);

// GET /api/notifications - Get user notifications
// router.get('/', notificationController.getNotifications);

// PUT /api/notifications/:id/read - Mark notification as read
// router.put('/:id/read', notificationController.markAsRead);

// PUT /api/notifications/read-all - Mark all notifications as read
// router.put('/read-all', notificationController.markAllAsRead);

export default router;
