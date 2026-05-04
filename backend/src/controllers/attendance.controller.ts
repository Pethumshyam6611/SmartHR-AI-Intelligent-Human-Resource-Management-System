import { Role } from '@prisma/client';
import type { Request, Response } from 'express';
import prisma from '../config/database';
import { calculateOvertimeHours, calculateWorkingHours } from '../utils/dateHelpers';

const getDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const earthRadius = 6371e3;
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
};

const parseCoordinates = (latitude?: string | number, longitude?: string | number) => {
  const lat = latitude !== undefined && latitude !== null && latitude !== '' ? Number(latitude) : null;
  const lon = longitude !== undefined && longitude !== null && longitude !== '' ? Number(longitude) : null;

  if (lat === null || lon === null || Number.isNaN(lat) || Number.isNaN(lon)) {
    return null;
  }

  return { lat, lon };
};

const validateOfficeRadius = (coords: { lat: number; lon: number } | null) => {
  const officeLat = Number(process.env.OFFICE_LATITUDE || 0);
  const officeLon = Number(process.env.OFFICE_LONGITUDE || 0);
  const officeRadius = Number(process.env.OFFICE_RADIUS_METERS || 100);

  if (!coords || !officeLat || !officeLon) {
    return null;
  }

  const distance = getDistanceInMeters(coords.lat, coords.lon, officeLat, officeLon);

  if (distance > officeRadius) {
    return `You are too far from the office. Distance: ${Math.round(distance)}m. Must be within ${officeRadius}m.`;
  }

  return null;
};

const getManagedDepartment = async (userId: string) => {
  const employee = await prisma.employee.findUnique({
    where: { userId },
    select: { department: true },
  });

  return employee?.department ?? null;
};

const canViewEmployeeAttendance = async (req: Request, employeeId: string) => {
  if (!req.user) {
    return false;
  }

  if (req.user.role === Role.ADMIN || req.user.role === Role.HR_MANAGER) {
    return true;
  }

  if (req.user.employeeId === employeeId) {
    return true;
  }

  if (req.user.role !== Role.DEPARTMENT_HEAD) {
    return false;
  }

  const [viewerDepartment, targetEmployee] = await Promise.all([
    getManagedDepartment(req.user.id),
    prisma.employee.findUnique({
      where: { id: employeeId },
      select: { department: true },
    }),
  ]);

  return Boolean(viewerDepartment && viewerDepartment === targetEmployee?.department);
};

export const clockIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeId = req.user?.employeeId;

    if (!employeeId) {
      res.status(400).json({ message: 'Employee ID not found' });
      return;
    }

    const coords = parseCoordinates(req.body.clockInLatitude, req.body.clockInLongitude);
    const radiusError = validateOfficeRadius(coords);

    if (radiusError) {
      res.status(400).json({ message: radiusError });
      return;
    }

    const { start, end } = getTodayRange();

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        employeeId,
        date: {
          gte: start,
          lt: end,
        },
        clockOut: null,
      },
    });

    if (existingAttendance) {
      res.status(400).json({ message: 'Already clocked in today' });
      return;
    }

    const attendance = await prisma.attendance.create({
      data: {
        employeeId,
        clockIn: new Date(),
        clockInLatitude: coords?.lat ?? null,
        clockInLongitude: coords?.lon ?? null,
        date: start,
      },
    });

    res.json({
      message: 'Clocked in successfully',
      attendance,
    });
  } catch (error) {
    console.error('Clock in error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const clockOut = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeId = req.user?.employeeId;

    if (!employeeId) {
      res.status(400).json({ message: 'Employee ID not found' });
      return;
    }

    const coords = parseCoordinates(req.body.clockOutLatitude, req.body.clockOutLongitude);
    const radiusError = validateOfficeRadius(coords);

    if (radiusError) {
      res.status(400).json({ message: radiusError });
      return;
    }

    const { start, end } = getTodayRange();

    const attendance = await prisma.attendance.findFirst({
      where: {
        employeeId,
        date: {
          gte: start,
          lt: end,
        },
        clockOut: null,
      },
    });

    if (!attendance) {
      res.status(400).json({ message: 'No active clock-in found' });
      return;
    }

    const clockOutTime = new Date();
    const workingHours = Number(calculateWorkingHours(attendance.clockIn, clockOutTime).toFixed(2));
    const overtimeHours = Number(calculateOvertimeHours(workingHours).toFixed(2));

    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        clockOut: clockOutTime,
        clockOutLatitude: coords?.lat ?? null,
        clockOutLongitude: coords?.lon ?? null,
        workingHours,
        overtimeHours,
      },
    });

    res.json({
      message: 'Clocked out successfully',
      attendance: updatedAttendance,
    });
  } catch (error) {
    console.error('Clock out error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMyAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const employeeId = req.user?.employeeId;

    if (!employeeId) {
      res.status(400).json({ message: 'Employee ID not found' });
      return;
    }

    const { startDate, endDate } = req.query;
    const whereClause: Record<string, unknown> = { employeeId };

    if (startDate || endDate) {
      whereClause.date = {};

      if (startDate) {
        (whereClause.date as Record<string, Date>).gte = new Date(startDate as string);
      }

      if (endDate) {
        const nextDay = new Date(endDate as string);
        nextDay.setDate(nextDay.getDate() + 1);
        (whereClause.date as Record<string, Date>).lt = nextDay;
      }
    }

    const attendances = await prisma.attendance.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
    });

    res.json(attendances);
  } catch (error) {
    console.error('Get my attendance error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getEmployeeAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;

    if (!(await canViewEmployeeAttendance(req, employeeId))) {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }

    const whereClause: Record<string, unknown> = { employeeId };

    if (startDate || endDate) {
      whereClause.date = {};

      if (startDate) {
        (whereClause.date as Record<string, Date>).gte = new Date(startDate as string);
      }

      if (endDate) {
        const nextDay = new Date(endDate as string);
        nextDay.setDate(nextDay.getDate() + 1);
        (whereClause.date as Record<string, Date>).lt = nextDay;
      }
    }

    const attendances = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true,
            department: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    res.json(attendances);
  } catch (error) {
    console.error('Get employee attendance error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAttendanceReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      res.status(400).json({ message: 'Month and year are required' });
      return;
    }

    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 1);

    const whereClause: Record<string, unknown> = {
      date: {
        gte: startDate,
        lt: endDate,
      },
    };

    if (req.user?.role === Role.DEPARTMENT_HEAD) {
      const department = await getManagedDepartment(req.user.id);
      whereClause.employee = {
        department: department ?? '__NO_DEPARTMENT__',
      };
    }

    const attendances = await prisma.attendance.groupBy({
      by: ['employeeId'],
      where: whereClause,
      _count: { id: true },
      _sum: {
        workingHours: true,
        overtimeHours: true,
      },
    });

    const employeeIds = attendances.map((record) => record.employeeId);
    const employees = await prisma.employee.findMany({
      where: {
        id: { in: employeeIds },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        position: true,
        department: true,
      },
    });

    const report = attendances.map((attendance) => ({
      employee: employees.find((employee) => employee.id === attendance.employeeId) ?? null,
      presentDays: attendance._count.id,
      totalWorkingHours: attendance._sum.workingHours ?? 0,
      totalOvertimeHours: attendance._sum.overtimeHours ?? 0,
    }));

    res.json(report);
  } catch (error) {
    console.error('Get attendance report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTodayAttendanceSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    if (
      !req.user ||
      (req.user.role !== Role.ADMIN &&
        req.user.role !== Role.HR_MANAGER &&
        req.user.role !== Role.DEPARTMENT_HEAD)
    ) {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }

    const { start, end } = getTodayRange();
    const employeeWhere =
      req.user?.role === Role.DEPARTMENT_HEAD
        ? {
            department: (await getManagedDepartment(req.user.id)) ?? '__NO_DEPARTMENT__',
          }
        : {};

    const [employeeCount, todayAttendances, activeSessions] = await Promise.all([
      prisma.employee.count({ where: employeeWhere }),
      prisma.attendance.findMany({
        where: {
          date: { gte: start, lt: end },
          employee: employeeWhere,
        },
      }),
      prisma.attendance.count({
        where: {
          date: { gte: start, lt: end },
          clockOut: null,
          employee: employeeWhere,
        },
      }),
    ]);

    res.json({
      totalEmployees: employeeCount,
      presentToday: todayAttendances.length,
      activeSessions,
    });
  } catch (error) {
    console.error('Get today attendance summary error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
