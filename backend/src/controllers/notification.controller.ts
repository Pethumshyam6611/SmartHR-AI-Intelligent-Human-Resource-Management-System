import { Request, Response } from 'express';
import prisma from '../config/database';

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(400).json({ message: 'User ID not found' });
            return;
        }

        const { isRead } = req.query;

        const whereClause: any = { userId };
        if (isRead !== undefined) {
            whereClause.isRead = isRead === 'true';
        }

        const notifications = await prisma.notification.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });

        res.json(notifications);
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            res.status(400).json({ message: 'User ID not found' });
            return;
        }

        const notification = await prisma.notification.findUnique({
            where: { id },
        });

        if (!notification) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }

        if (notification.userId !== userId) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        const updatedNotification = await prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });

        res.json({
            message: 'Notification marked as read',
            notification: updatedNotification,
        });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(400).json({ message: 'User ID not found' });
            return;
        }

        await prisma.notification.updateMany({
            where: {
                userId,
                isRead: false,
            },
            data: { isRead: true },
        });

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Mark all as read error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
