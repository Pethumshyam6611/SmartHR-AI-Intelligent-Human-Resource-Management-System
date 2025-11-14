import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
// Controllers will be implemented later

const router = Router();

router.use(authenticate);

// POST /api/leaves - Apply for leave
// router.post('/', leaveController.applyLeave);

// GET /api/leaves/my-leaves - Get own leave records
// router.get('/my-leaves', leaveController.getMyLeaves);

// GET /api/leaves - Get all leave requests (HR/Admin)
// router.get('/', authorize('ADMIN', 'HR_MANAGER'), leaveController.getAllLeaves);

// PUT /api/leaves/:id/approve - Approve leave (HR/Admin)
// router.put('/:id/approve', authorize('ADMIN', 'HR_MANAGER'), leaveController.approveLeave);

// PUT /api/leaves/:id/reject - Reject leave (HR/Admin)
// router.put('/:id/reject', authorize('ADMIN', 'HR_MANAGER'), leaveController.rejectLeave);

export default router;
