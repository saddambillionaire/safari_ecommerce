import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { createOrder, getUserOrders } from "../api/order.api.js";

const router = Router();

router.post("/", protectRoute, createOrder);
router.get("/", protectRoute, getUserOrders);

export default router;