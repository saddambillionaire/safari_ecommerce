import { Router } from "express";
import { CreateProduct } from "../controllers/admin.controller.js";
import { adminOnly } from "../middlewares/auth.middleware.js";
import { upload} from "../middlewares/multer.middleware.js";

const router = Router();
router.use(protectRoute, adminOnly); // Apply the protectRoute middleware to all routes in this router

router.post("/products",upload.array("images", 3), CreateProduct);
router.get("/products", getAllProducts);
router.put("/products/:id", upload.array("images", 3),updateProduct);

router.get("/orders", getAllOrders);
router.patch("/orders/:orderId/status", updateOrderStatus);

router.get("/customers", getAllCustomers);
router.get("/stats", getDashboardStats);

// put: update the entire resource, for example updating all the details of a product, including name, description, price, stock, category and images.
// patch: update part of the resource, for example just the status of an order, without affecting other fields.
export default router;