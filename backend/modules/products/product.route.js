import { Router } from "express";

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  deleteProductImage,
} from "./product.controller.js";

import requireAuth from "../../middleware/auth.middleware.js";
import authorizeRoles from "../../middleware/role.middleware.js";
import upload from "../../middleware/upload.middleware.js";

const router = Router();

router.post(
  "/",
  requireAuth,
  authorizeRoles("admin", "manager", "employee"),
  createProduct,
);

router.get(
  "/",
  requireAuth,
  authorizeRoles("admin", "manager", "employee"),
  getAllProducts,
);

router.get(
  "/:productId",
  requireAuth,
  authorizeRoles("admin", "manager", "employee"),
  getProductById,
);

router.put(
  "/:productId",
  requireAuth,
  authorizeRoles("admin", "manager", "employee"),
  updateProduct,
);

router.put(
  "/:productId/images",
  requireAuth,
  authorizeRoles("admin", "manager", "employee"),
  upload.single("productImage"),
  uploadProductImage,
);

router.delete(
  "/:productId",
  requireAuth,
  authorizeRoles("admin", "manager"),
  deleteProduct
);

router.delete(
  "/:productId/images",
  requireAuth,
  authorizeRoles("admin", "manager", "employee"),
  deleteProductImage,
);

export default router;