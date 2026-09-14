import express from "express";
import { getLowStockReport, getLowStockReportCSV, getStockMovementReport } from "./report.controller.js";
import requireAuth from "../../middleware/auth.middleware.js";
import authorizeRoles from "../../middleware/role.middleware.js";

const router = express.Router();

router.get("/low-stock", requireAuth, authorizeRoles("admin"), getLowStockReport);
router.get("/low-stock/csv", requireAuth, authorizeRoles("admin"), getLowStockReportCSV);
router.get("/stock-movements", requireAuth, authorizeRoles("admin"), getStockMovementReport);

export default router;