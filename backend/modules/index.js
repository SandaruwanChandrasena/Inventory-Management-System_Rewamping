import { Router } from "express";

import authRoutes from "./auth/auth.route.js";
import categoryRoutes from "./products/category.route.js";
import productRoutes from "./products/product.route.js";
import stockRoutes from "./stock/stock.route.js";
import reportRoutes from "./reports/report.route.js";
import assistantRoutes from "./assistant/assistant.route.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", categoryRoutes);
router.use("/products", productRoutes);
router.use("/stock", stockRoutes);
router.use("/reports", reportRoutes);
router.use("/assistant", assistantRoutes);

export default router;