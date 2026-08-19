import { Router } from "express";

import productController from "./product.controller.js";
import requireAuth from "../../middleware/auth.middleware.js";
import authorizeRoles from "../../middleware/role.middleware.js";

const router = Router();

router.post(
  "/",
  requireAuth,
  authorizeRoles("admin", "manager", "employee"),
  productController.createProduct,
);

router.get(
  "/",
  requireAuth,
  authorizeRoles("admin", "manager", "employee"),
  productController.getAllProducts,
);

router.get(
  "/:productId",
  requireAuth,
  authorizeRoles("admin", "manager", "employee"),
  productController.getProductById,
);

router.put(
  "/:productId",
  requireAuth,
  authorizeRoles("admin", "manager", "employee"),
  productController.updateProduct,
);

router.delete(
  "/:productId",
  requireAuth,
  authorizeRoles("admin", "manager"),
  productController.deleteProduct
);

export default router;
