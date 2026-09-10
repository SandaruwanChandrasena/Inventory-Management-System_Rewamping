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

/* Create Product */
router.post(
  "/",
  requireAuth,
  authorizeRoles("admin", "manager", "employee"),
  createProduct,
);

/* Get All Products */
router.get(
  "/",
  requireAuth,
  authorizeRoles("admin", "manager", "employee"),
  getAllProducts,
);

/* Get Product By Id */
router.get(
  "/:productId",
  requireAuth,
  authorizeRoles("admin", "manager", "employee"),
  getProductById,
);

/* Update Product */
router.put(
  "/:productId",
  requireAuth,
  authorizeRoles("admin", "manager", "employee"),
  updateProduct,
);

/* Upload Product Image */
router.put(
  "/:productId/images",
  requireAuth,
  authorizeRoles("admin", "manager", "employee"),
  upload.single("productImage"),
  uploadProductImage,
);

/* Delete Product */
router.delete(
  "/:productId",
  requireAuth,
  authorizeRoles("admin", "manager"),
  deleteProduct
);

/* Delete Product Image */
router.delete(
  "/:productId/images",
  requireAuth,
  authorizeRoles("admin", "manager", "employee"),
  deleteProductImage,
);

export default router;