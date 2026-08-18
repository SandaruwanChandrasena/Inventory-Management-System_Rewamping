import { Router } from "express";

import authRoutes from "./auth/auth.route.js";
import categoryRoutes from "./products/category.route.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", categoryRoutes);

export default router;