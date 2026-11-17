import { Router } from "express";
import { getNotices } from "../controllers/notice.controller.js";

const router = Router();

router.get("/", getNotices);

export default router;
