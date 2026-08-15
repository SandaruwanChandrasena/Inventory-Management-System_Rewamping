import { Router } from "express";
import requireAuth from "../../middleware/auth.middleware.js";
import authorizeRoles from "../../middleware/role.middleware.js";
import {
  registerUser,
  login,
  getProfile,
  editProfile,
  uploadImage,
  getUsers,
  getUser,
} from "./auth.controller.js";
import upload from "../../middleware/upload.middleware.js";

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

// Update user profile
router.put("/profile", requireAuth, editProfile);

// Upload profile image
router.put(
  "/profile/image",
  requireAuth,
  upload.single("profileImage"),
  uploadImage,
);

// Get all users
router.get(
  "/users",
  requireAuth,
  authorizeRoles("admin", "manager"),
  getUsers
);

// Get user details
router.get(
  "/users/:userId",
  requireAuth,
  authorizeRoles("admin", "manager"),
  getUser
);

export default router;
