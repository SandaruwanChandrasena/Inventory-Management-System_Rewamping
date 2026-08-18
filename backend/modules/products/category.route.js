import { Router } from "express";

import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  updateCategoryController,
} from "./category.controller.js";

import requireAuth from "../../middleware/auth.middleware.js";
import authorizeRoles from "../../middleware/role.middleware.js";

const router = Router();

/* Category Routes */
router.post("/categories", requireAuth, createCategoryController);

/* Get All Categories */
router.get("/categories", requireAuth, getAllCategoriesController);


/* Update Category */
router.put("/categories/:categoryId", requireAuth, updateCategoryController);


/* Delete Category */
router.delete(
  "/categories/:categoryId",
  requireAuth,
  authorizeRoles("admin"),
  deleteCategoryController,
);

export default router;
