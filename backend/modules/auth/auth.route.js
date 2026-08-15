import { Router } from "express";
import requireAuth from "../../middleware/auth.middleware.js";
import authorizeRoles from "../../middleware/role.middleware.js";
import { registerUser, login, getProfile } from "./auth.controller.js";

const router = Router();

// Login
router.post("/login", login);

// Create user
router.post(
  "/users",
  requireAuth,
  authorizeRoles("admin", "manager"),
  registerUser,
);

// Get user profile
router.get("/profile", requireAuth, getProfile);

export default router;
