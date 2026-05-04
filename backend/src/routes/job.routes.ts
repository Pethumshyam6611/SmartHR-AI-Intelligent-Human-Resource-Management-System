import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as jobController from '../controllers/job.controller';

const router = Router();

// Public routes (no auth required)
// GET /api/jobs - Get all open jobs
router.get('/', jobController.getAllJobs);

// GET /api/jobs/:id - Get job by ID
router.get('/:id', jobController.getJobById);

// Protected routes (require authentication)
router.use(authenticate);

// POST /api/jobs - Create job (Admin/HR)
router.post('/', authorize('ADMIN', 'HR_MANAGER'), jobController.createJob);

// PUT /api/jobs/:id - Update job (Admin/HR)
router.put('/:id', authorize('ADMIN', 'HR_MANAGER'), jobController.updateJob);

// DELETE /api/jobs/:id - Delete job (Admin/HR)
router.delete('/:id', authorize('ADMIN', 'HR_MANAGER'), jobController.deleteJob);

export default router;
