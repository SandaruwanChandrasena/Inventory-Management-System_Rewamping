import { Router } from "express";
import requireAuth from "../../middleware/auth.middleware.js";
import authorizeRoles from "../../middleware/role.middleware.js";
import { registerUser, login, getProfile, editProfile } from "./auth.controller.js";

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

router.put("/profile", requireAuth, editProfile);

export default router;
