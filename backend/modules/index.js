import { Router } from "express";

import authRoutes from "./auth/auth.route.js";
import categoryRoutes from "./products/category.route.js";
import productRoutes from "./products/product.route.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", categoryRoutes);
router.use("/products", productRoutes);

export default router;