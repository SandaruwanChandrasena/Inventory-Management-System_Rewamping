import { Router } from "express";

import {
  createCategoryController,
  getAllCategoriesController,
  updateCategoryController,
} from "./category.controller.js";

import requireAuth from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/categories", requireAuth, createCategoryController);

router.get("/categories", requireAuth, getAllCategoriesController);

router.put("/categories/:categoryId", requireAuth, updateCategoryController);

export default router;
