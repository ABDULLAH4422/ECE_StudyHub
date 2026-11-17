import { Router } from "express";
import { getAttendanceSummary } from "../controllers/attendance.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/summary", authenticate, getAttendanceSummary);

export default router;
