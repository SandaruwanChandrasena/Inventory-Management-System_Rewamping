import { Router } from "express";

import productController from "./product.controller.js";
import requireAuth from "../../middleware/auth.middleware.js";
import authorizeRoles from "../../middleware/role.middleware.js";

const router = Router();

router.post(
  "/",
  requireAuth,
  authorizeRoles("admin", "manager", "employee"),
  productController.createProduct
);

export default router;