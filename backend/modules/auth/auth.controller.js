import asyncHandler from "express-async-handler";
import { createUser, loginUser, getUserProfile } from "./auth.service.js";


// Register user
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

// Login user
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

const getProfile = asyncHandler(async (req, res) => {
  const { user, profile, age } = await getUserProfile(req.user._id);

  res.status(200).json({
    success: true,
    user,
    profile,
    age,
  });
});


export { registerUser, login, getProfile };
