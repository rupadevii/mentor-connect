import { Router } from "express";
import { getTopics } from "../controllers/topicController.js";

const router = Router()

router.get("/", getTopics)

export default router