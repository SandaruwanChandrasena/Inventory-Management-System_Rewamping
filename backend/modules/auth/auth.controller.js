import asyncHandler from "express-async-handler";
import { createUser, loginUser } from "./auth.service.js";

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

export { registerUser, login };
