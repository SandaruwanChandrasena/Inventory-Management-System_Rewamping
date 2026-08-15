import asyncHandler from "express-async-handler";
import {
  createUser,
  loginUser,
  getUserProfile,
  updateProfile,
  uploadProfileImage,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  logoutUser,
} from "./auth.service.js";

/* Register user - A/ M */

const registerUser = asyncHandler(async (req, res) => {
  const user = await createUser({
    ...req.body,
    createdBy: req.user,
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user,
  });
});

/* Login user - A/ M/ E */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const { user, token } = await loginUser(email, password);

  // console.log(user);

  const userResponse = user.toObject();
  delete userResponse.password;

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user,
  });
});

/* Profile Management */
/* Get user profile - A/ M/ E */
const getProfile = asyncHandler(async (req, res) => {
  const { user, profile, age } = await getUserProfile(req.user._id);

  res.status(200).json({
    success: true,
    user,
    profile,
    age,
  });
});

/* Edit user profile - A/ M/ E */
const editProfile = asyncHandler(async (req, res) => {
  const profile = await updateProfile(req.user._id, req.body);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    profile,
  });
});

/* Upload profile image - A/ M/ E */
const uploadImage = asyncHandler(async (req, res) => {
  const profile = await uploadProfileImage(req.user._id, req.file);

  res.status(200).json({
    success: true,
    message: "Profile image uploaded successfully",
    profile,
  });
});

/* User Management */
/* Get all users - A/ M */
const getUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsers(req.user.role);

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

/* Get user details */
const getUser = asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.userId, req.user.role);

  res.status(200).json({
    success: true,
    user,
  });
});

/* Update user */
const editUser = asyncHandler(async (req, res) => {
  const user = await updateUser(req.params.userId, req.user.role, req.body);

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user,
  });
});

/* Permanently delete user */
const removeUser = asyncHandler(async (req, res) => {
  await deleteUser(req.params.userId, req.user.role);

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

/* Logout user */
const logout = asyncHandler(async (req, res) => {
  await logoutUser(req.user._id);

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

export {
  registerUser,
  login,
  getProfile,
  editProfile,
  uploadImage,
  getUsers,
  getUser,
  editUser,
  removeUser,
  logout,
};
