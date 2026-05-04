import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as employeeController from '../controllers/employee.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/employees - Get all employees (Admin/HR Manager/Department Head)
router.get('/', authorize('ADMIN', 'HR_MANAGER', 'DEPARTMENT_HEAD'), employeeController.getAllEmployees);

// GET /api/employees/:id - Get employee by ID
router.get('/:id', employeeController.getEmployeeById);

// PUT /api/employees/:id - Update employee
router.put('/:id', authorize('ADMIN', 'HR_MANAGER'), employeeController.updateEmployee);

// PATCH /api/employees/:id/toggle-status - Toggle employee status (Admin/HR Manager only)
router.patch('/:id/toggle-status', authorize('ADMIN', 'HR_MANAGER'), employeeController.toggleEmployeeStatus);

// DELETE /api/employees/:id - Delete employee (Admin only)
router.delete('/:id', authorize('ADMIN'), employeeController.deleteEmployee);

export default router;
