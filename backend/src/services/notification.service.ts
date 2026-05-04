import { Role } from '@prisma/client';
import prisma from '../config/database';

interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: string;
}

export const createNotification = async (payload: NotificationPayload) => {
  return prisma.notification.create({ data: payload });
};

export const notifyUsers = async (userIds: string[], title: string, message: string, type: string) => {
  const uniqueUserIds = [...new Set(userIds.filter(Boolean))];

  if (uniqueUserIds.length === 0) {
    return;
  }

  await prisma.notification.createMany({
    data: uniqueUserIds.map((userId) => ({
      userId,
      title,
      message,
      type,
    })),
  });
};

export const notifyRoles = async (roles: Role[], title: string, message: string, type: string) => {
  const users = await prisma.user.findMany({
    where: {
      role: { in: roles },
      status: 'ACTIVE',
    },
    select: { id: true },
  });

  await notifyUsers(
    users.map((user) => user.id),
    title,
    message,
    type
  );
};

export const notifyDepartmentHeads = async (
  department: string | null | undefined,
  title: string,
  message: string,
  type: string
) => {
  if (!department) {
    return;
  }

  const departmentHeads = await prisma.user.findMany({
    where: {
      role: 'DEPARTMENT_HEAD',
      status: 'ACTIVE',
      employee: {
        department,
      },
    },
    select: { id: true },
  });

  await notifyUsers(
    departmentHeads.map((user) => user.id),
    title,
    message,
    type
  );
};
