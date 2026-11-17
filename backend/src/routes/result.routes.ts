import { Router } from "express";
import { getResults } from "../controllers/result.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getResults);

export default router;
