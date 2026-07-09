import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { bookSession, cancelSession, createSession, getDashboardStats, getSessionById, getSessions, submitMenteeFeedback, submitMentorFeedback } from "../controllers/sessionController.js";

const router = Router()

router.use(protect);

router.get('/', getSessions)
router.get('/dashboard', getDashboardStats)
router.get('/:id', getSessionById)
router.post('/', createSession)
router.patch('/book/:sessionId', bookSession)
router.patch('/cancel/:sessionId', cancelSession)
router.post('/feedback/mentor/:id', submitMentorFeedback)
router.post('/feedback/mentee/:id', submitMenteeFeedback)

export default router