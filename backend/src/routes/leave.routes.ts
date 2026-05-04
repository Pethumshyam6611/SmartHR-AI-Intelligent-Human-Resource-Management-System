import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as leaveController from '../controllers/leave.controller';

const router = Router();

router.use(authenticate);

// POST /api/leaves - Apply for leave
router.post('/', leaveController.applyLeave);

// GET /api/leaves/my-leaves - Get own leaves
router.get('/my-leaves', leaveController.getMyLeaves);

// GET /api/leaves - Get leave requests available to the current reviewer
router.get('/', authorize('ADMIN', 'HR_MANAGER', 'DEPARTMENT_HEAD'), leaveController.getAllLeaves);

// PUT /api/leaves/:id/approve - Approve leave
router.put('/:id/approve', authorize('ADMIN', 'HR_MANAGER', 'DEPARTMENT_HEAD'), leaveController.approveLeave);

// PUT /api/leaves/:id/reject - Reject leave
router.put('/:id/reject', authorize('ADMIN', 'HR_MANAGER', 'DEPARTMENT_HEAD'), leaveController.rejectLeave);

export default router;
