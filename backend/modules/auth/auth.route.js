import { Router } from "express";
import { registerUser, login } from "./auth.controller.js";
import requireAuth from "../../middleware/auth.middleware.js";
import authorizeRoles from "../../middleware/role.middleware.js";

const router = Router();

// Login
router.post("/login", login);

// Create user
router.post(
  "/users",
  requireAuth,
  authorizeRoles("admin", "manager"),
  registerUser
);

export default router;