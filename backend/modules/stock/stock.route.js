import { Router } from "express";

import { stockIn, stockOut } from "./stock.controller.js";
import requireAuth from "../../middleware/auth.middleware.js";
import authorizeRoles from "../../middleware/role.middleware.js";

const router = Router();

/* Stock In */
router.post(
  "/:productId/in",
  requireAuth,
  authorizeRoles("admin", "manager", "employee"),
  stockIn,
);

/* Stock Out */
router.post(
  "/:productId/out",
  requireAuth,
  authorizeRoles("admin", "manager", "employee"),
  stockOut,
);

export default router;