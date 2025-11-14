import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
// Controllers will be implemented later

const router = Router();

router.use(authenticate);

// POST /api/ai/recommend-leave - AI-powered leave recommendation
// router.post('/recommend-leave', aiController.recommendLeave);

// POST /api/ai/analyze-resume - AI resume screening
// router.post('/analyze-resume', authorize('ADMIN', 'HR_MANAGER'), aiController.analyzeResume);

// POST /api/ai/salary-analysis - AI salary and payroll analysis
// router.post('/salary-analysis', authorize('ADMIN', 'HR_MANAGER'), aiController.analyzeSalary);

// POST /api/ai/hr-assistant - AI HR Assistant for queries
// router.post('/hr-assistant', authorize('ADMIN', 'HR_MANAGER'), aiController.hrAssistant);

// GET /api/ai/attendance-insights - AI-powered attendance insights
// router.get('/attendance-insights', authorize('ADMIN', 'HR_MANAGER'), aiController.attendanceInsights);

export default router;
