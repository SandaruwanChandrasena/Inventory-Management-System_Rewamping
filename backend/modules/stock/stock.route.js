import { Router } from "express";

import { stockIn, stockOut, stockAdjustment, getStockHistory, getLowStockProducts } from "./stock.controller.js";
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

/* Stock Adjustment */
router.put(
  "/:productId/adjustment",
  requireAuth,
  authorizeRoles("admin", "manager", "employee"),
  stockAdjustment,
);

/* Get Stock Movement History */
router.get(
  "/:productId/history",
  requireAuth,
  authorizeRoles("admin", "manager", "employee"),
  getStockHistory,
);

/* Get Low Stock Products */
router.get(
  "/low-stock",
  requireAuth,
  authorizeRoles("admin", "manager", "employee"),
  getLowStockProducts,
);

export default router;