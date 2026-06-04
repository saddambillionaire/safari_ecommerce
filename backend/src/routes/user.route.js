import { Router } from "express";
import { addAddress, getAddress, addToWishlist, updateAddress, deleteAddress, getWishlist, removeFromWishlist } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router()
router.use(protectRoute)

// address endpoints or routes
router.post("/addresses", addAddress);
router.get("/addresses", getAddress);
router.put("/addresses/:addressId", updateAddress);
router.delete("/addresses/:addressId", deleteAddress);

// wishlist routes
router.post("/wishlist", addToWishlist);
router.get("/addresses", getWishlist);
router.delete("/wishlist/:productId", removeFromWishlist);

export default router