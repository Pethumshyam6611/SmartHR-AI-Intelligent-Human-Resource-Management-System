import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
// Controllers will be implemented later

const router = Router();

router.use(authenticate);

// POST /api/payroll/generate - Generate payroll for a month (Admin/HR Manager)
// router.post('/generate', authorize('ADMIN', 'HR_MANAGER'), payrollController.generatePayroll);

// GET /api/payroll/my-payroll - Get own payroll records
// router.get('/my-payroll', payrollController.getMyPayroll);

// GET /api/payroll/employee/:employeeId - Get payroll for specific employee (HR/Admin)
// router.get('/employee/:employeeId', authorize('ADMIN', 'HR_MANAGER'), payrollController.getEmployeePayroll);

// GET /api/payroll/:id/download - Download salary slip PDF
// router.get('/:id/download', payrollController.downloadSalarySlip);

export default router;
