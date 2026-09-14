import express from "express";
import {
  getLowStockReport,
  getLowStockReportCSV,
  getStockMovementReport,
  getStockMovementReportCSV,
} from "./report.controller.js";
import requireAuth from "../../middleware/auth.middleware.js";
import authorizeRoles from "../../middleware/role.middleware.js";

const router = express.Router();

router.get("/low-stock", requireAuth, authorizeRoles("admin"), getLowStockReport);
router.get("/low-stock/csv", requireAuth, authorizeRoles("admin"), getLowStockReportCSV);
router.get("/stock-movements", requireAuth, authorizeRoles("admin"), getStockMovementReport);
router.get("/stock-movements/csv", requireAuth, authorizeRoles("admin"), getStockMovementReportCSV);

export default router;