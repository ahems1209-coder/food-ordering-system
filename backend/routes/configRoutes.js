import express from "express";
import { getConfig, updateConfig } from "../controllers/configController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getConfig); // Publicly readable for validation
router.patch("/", protect, adminOnly, updateConfig); // Admin only

export default router;
