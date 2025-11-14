import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
// Controllers will be implemented later

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/employees - Get all employees (Admin/HR Manager only)
// router.get('/', authorize('ADMIN', 'HR_MANAGER'), employeeController.getAllEmployees);

// GET /api/employees/:id - Get employee by ID
// router.get('/:id', employeeController.getEmployeeById);

// PUT /api/employees/:id - Update employee
// router.put('/:id', authorize('ADMIN', 'HR_MANAGER'), employeeController.updateEmployee);

// DELETE /api/employees/:id - Delete employee (Admin only)
// router.delete('/:id', authorize('ADMIN'), employeeController.deleteEmployee);

export default router;
