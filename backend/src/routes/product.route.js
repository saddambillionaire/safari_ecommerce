import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getAllProducts } from "../api/admin.api.js";
import { getProductById } from "../api/product.api.js";

const router = Router();

router.get("/", protectRoute, getAllProducts);
router.get("/:id", protectRoute, getProductById);

export default router;