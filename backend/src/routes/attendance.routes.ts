import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
// Controllers will be implemented later

const router = Router();

router.use(authenticate);

// POST /api/attendance/clock-in - Clock in with GPS
// router.post('/clock-in', attendanceController.clockIn);

// POST /api/attendance/clock-out - Clock out with GPS
// router.post('/clock-out', attendanceController.clockOut);

// GET /api/attendance/my-attendance - Get own attendance records
// router.get('/my-attendance', attendanceController.getMyAttendance);

// GET /api/attendance/employee/:employeeId - Get attendance for specific employee (HR/Admin)
// router.get('/employee/:employeeId', authorize('ADMIN', 'HR_MANAGER'), attendanceController.getEmployeeAttendance);

// GET /api/attendance/report - Get attendance report (HR/Admin)
// router.get('/report', authorize('ADMIN', 'HR_MANAGER'), attendanceController.getAttendanceReport);

export default router;
