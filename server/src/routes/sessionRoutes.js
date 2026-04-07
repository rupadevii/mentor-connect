import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { bookSession, cancelSession, createSession, getDashboardStats, getSessions } from "../controllers/sessionController.js";

const router = Router()

router.use(protect);

router.get('/', getSessions)
router.post('/', createSession)
router.patch('/book/:sessionId', bookSession)
router.get('/dashboard', getDashboardStats)
router.patch('/cancel/:sessionId', cancelSession)

export default router