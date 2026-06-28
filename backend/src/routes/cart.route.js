import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../api/cart.api.js";

const router = Router();

router.use(protectRoute);

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:productId", updateCartItem);
router.delete("/:productId", removeFromCart);
router.delete("/", clearCart);
router.get("/ping", (req, res) => {
  console.log("🔥 PING HIT");

  return res.status(200).json({
    success: true,
    message: "PING WORKS",
  });
});

export default router;