import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
// import multer from 'multer';
// Controllers will be implemented later

const router = Router();

// const upload = multer({ dest: 'uploads/resumes/' });

// POST /api/applications - Submit job application (public)
// router.post('/', upload.single('resume'), applicationController.submitApplication);

// Protected routes
router.use(authenticate);

// GET /api/applications/job/:jobId - Get all applications for a job (HR/Admin)
// router.get('/job/:jobId', authorize('ADMIN', 'HR_MANAGER'), applicationController.getApplicationsByJob);

// GET /api/applications/:id - Get application details (HR/Admin)
// router.get('/:id', authorize('ADMIN', 'HR_MANAGER'), applicationController.getApplicationById);

// PUT /api/applications/:id/status - Update application status (HR/Admin)
// router.put('/:id/status', authorize('ADMIN', 'HR_MANAGER'), applicationController.updateApplicationStatus);

export default router;
