import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as attendanceController from '../controllers/attendance.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// POST /api/attendance/clock-in - Clock in
router.post('/clock-in', attendanceController.clockIn);

// POST /api/attendance/clock-out - Clock out
router.post('/clock-out', attendanceController.clockOut);

// GET /api/attendance/my-attendance - Get my attendance
router.get('/my-attendance', attendanceController.getMyAttendance);

// GET /api/attendance/summary/today - Get today's attendance summary
router.get('/summary/today', authorize('ADMIN', 'HR_MANAGER', 'DEPARTMENT_HEAD'), attendanceController.getTodayAttendanceSummary);

// GET /api/attendance/employee/:employeeId - Get employee attendance
router.get('/employee/:employeeId', authorize('ADMIN', 'HR_MANAGER', 'DEPARTMENT_HEAD'), attendanceController.getEmployeeAttendance);

// GET /api/attendance/report - Get attendance report
router.get('/report', authorize('ADMIN', 'HR_MANAGER', 'DEPARTMENT_HEAD'), attendanceController.getAttendanceReport);

export default router;
