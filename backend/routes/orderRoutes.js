import express from "express";
import { placeOrder, getAllOrders, updateOrderStatus, getOrderStats, getOrderById } from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", placeOrder); // Public (customers ordering)
router.get("/all", protect, adminOnly, getAllOrders); // Admin/Kitchen
router.get("/stats", protect, adminOnly, getOrderStats); // Admin
router.get("/:id", getOrderById); // Public (customer tracking)
router.patch("/:id", protect, adminOnly, updateOrderStatus); // Admin/Kitchen

export default router;