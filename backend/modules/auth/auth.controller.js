import asyncHandler from "express-async-handler";
import { createUser, loginUser, getUserProfile, updateProfile, uploadProfileImage, getAllUsers} from "./auth.service.js";
 
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
  const profile = await updateProfile(
    req.user._id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    profile,
  });
});

/* Upload profile image - A/ M/ E */
const uploadImage = asyncHandler(async (req, res) => {
  const profile = await uploadProfileImage(
    req.user._id,
    req.file
  );

  res.status(200).json({
    success: true,
    message: "Profile image uploaded successfully",
    profile,
  });
});


/* Get all users - A/ M */
const getUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsers();

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

export { registerUser, login, getProfile, editProfile, uploadImage, getUsers };
