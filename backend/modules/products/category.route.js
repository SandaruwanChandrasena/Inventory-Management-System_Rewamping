import { Router } from "express";
import { createCategoryController } from "./category.controller.js";
import requireAuth from "../../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/categories",
  requireAuth,
  createCategoryController
);

export default router;