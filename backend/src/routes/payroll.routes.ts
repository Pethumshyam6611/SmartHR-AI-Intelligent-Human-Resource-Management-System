import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as payrollController from '../controllers/payroll.controller';

const router = Router();

router.use(authenticate);

// POST /api/payroll/generate - Generate payroll (Admin/HR)
router.post('/generate', authorize('ADMIN', 'HR_MANAGER'), payrollController.generatePayroll);

// GET /api/payroll/my-payroll - Get own payroll
router.get('/my-payroll', payrollController.getMyPayroll);

// GET /api/payroll/all - Get all payrolls (Admin/HR)
router.get('/all', authorize('ADMIN', 'HR_MANAGER'), payrollController.getAllPayrolls);

// GET /api/payroll/employee/:employeeId - Get employee payroll (Admin/HR)
router.get('/employee/:employeeId', authorize('ADMIN', 'HR_MANAGER'), payrollController.getEmployeePayroll);

// GET /api/payroll/:id/download - Download salary slip
router.get('/:id/download', payrollController.downloadSalarySlip);

// POST /api/payroll/generate - Generate payroll for a month (Admin/HR Manager)
// router.post('/generate', authorize('ADMIN', 'HR_MANAGER'), payrollController.generatePayroll);

// GET /api/payroll/my-payroll - Get own payroll records
// router.get('/my-payroll', payrollController.getMyPayroll);

// GET /api/payroll/employee/:employeeId - Get payroll for specific employee (HR/Admin)
// router.get('/employee/:employeeId', authorize('ADMIN', 'HR_MANAGER'), payrollController.getEmployeePayroll);

// GET /api/payroll/:id/download - Download salary slip PDF
// router.get('/:id/download', payrollController.downloadSalarySlip);

export default router;
