import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as notificationController from '../controllers/notification.controller';

const router = Router();

router.use(authenticate);

// GET /api/notifications - Get notifications
router.get('/', notificationController.getNotifications);

// PUT /api/notifications/:id/read - Mark as read
router.put('/:id/read', notificationController.markAsRead);

// PUT /api/notifications/read-all - Mark all as read
router.put('/read-all', notificationController.markAllAsRead);

// GET /api/notifications - Get user notifications
// router.get('/', notificationController.getNotifications);

// PUT /api/notifications/:id/read - Mark notification as read
// router.put('/:id/read', notificationController.markAsRead);

// PUT /api/notifications/read-all - Mark all notifications as read
// router.put('/read-all', notificationController.markAllAsRead);

export default router;
