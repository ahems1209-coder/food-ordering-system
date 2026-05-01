import express from "express";
import { getFoods, addFood, deleteFood, updateFood } from "../controllers/foodController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getFoods); // Public
router.post("/", protect, adminOnly, addFood); // Locked 🔒
router.delete("/:id", protect, adminOnly, deleteFood); // Locked 🔒
router.patch("/:id", protect, adminOnly, updateFood); // Locked 🔒

export default router;