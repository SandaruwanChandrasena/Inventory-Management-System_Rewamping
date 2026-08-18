import { Router } from "express";

import {
  createCategoryController,
  getAllCategoriesController,
} from "./category.controller.js";

import requireAuth from "../../middleware/auth.middleware.js";

const router = Router();


/* Create Category Routes */
router.post("/categories", requireAuth, createCategoryController);

/* Get All Categories Routes */
router.get("/categories", requireAuth, getAllCategoriesController);

export default router;
