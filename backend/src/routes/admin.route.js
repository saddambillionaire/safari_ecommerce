import { Router } from 'express';
import { createProduct,updateOrderStatus, getAllCustomers, getAllProducts, updateProduct, getAllOrders,deleteProduct, getDashboardStats } from '../controllers/admin.controller.js';
import { protectRoute, adminOnly } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();
// All routes in this router will be protected and only accessible by admin users
// put: used to update a resource, patch: used to update a specific attribute of a resource
router.use(protectRoute, adminOnly);

router.post('/products',upload.array('images', 3), createProduct);
router.get('/products', getAllProducts);
router.put('/products/:id',upload.array('images', 3), updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/orders', getAllOrders);
router.patch('/orders/:orderId/status', updateOrderStatus);

router.get('/customers', getAllCustomers);
router.get("stats", getDashboardStats);

export default router;
