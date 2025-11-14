import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
// Controllers will be implemented later

const router = Router();

// GET /api/jobs - Get all open job postings (public)
// router.get('/', jobController.getAllJobs);

// GET /api/jobs/:id - Get job posting by ID (public)
// router.get('/:id', jobController.getJobById);

// Protected routes
router.use(authenticate);

// POST /api/jobs - Create job posting (HR/Admin)
// router.post('/', authorize('ADMIN', 'HR_MANAGER'), jobController.createJob);

// PUT /api/jobs/:id - Update job posting (HR/Admin)
// router.put('/:id', authorize('ADMIN', 'HR_MANAGER'), jobController.updateJob);

// DELETE /api/jobs/:id - Delete job posting (HR/Admin)
// router.delete('/:id', authorize('ADMIN', 'HR_MANAGER'), jobController.deleteJob);

export default router;
