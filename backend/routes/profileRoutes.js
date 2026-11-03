import express from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { getProfile } from "../controllers/profileController.js";

const router = express.Router();

router.get("/", requireAuth, getProfile);

export default router;
