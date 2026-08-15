import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./auth.model.js";
import Profile from "./profile.model.js";
import calculateAge from "../../utils/calculateAge.js";


// Create a new user
const createUser = async ({
  firstName,
  lastName,
  dateOfBirth,
  email,
  password,
  idNumber,
  role,
  createdBy,
}) => {
  // Check if email already exists
  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
    throw new Error("Email already exists");
  }

  // Check if ID number already exists
  const existingIdNumber = await User.findOne({ idNumber });

  if (existingIdNumber) {
    throw new Error("ID number already exists");
  }

  // Check who is creating the user
  if (createdBy.role === "manager" && role !== "employee") {
    throw new Error("Manager can only create employees");
  }

  if (createdBy.role === "admin" && role === "admin") {
    throw new Error("Admin cannot create another admin");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    dateOfBirth,
    email,
    password: hashedPassword,
    idNumber,
    role,
  });

  // Create empty profile for the user
  await Profile.create({
    user: user._id,
  });

  return user;
};


// Login user
const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (user.accountStatus === "blocked") {
    throw new Error("Your account is blocked");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      tokenVersion: user.tokenVersion,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  // Remove password before returning user
  user.password = undefined;

  return { user, token };
};

// Get user profile
const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select(
    "-password -tokenVersion"
  );

  if (!user) {
    throw new Error("User not found");
  }

  const profile = await Profile.findOne({ user: userId });

  if (!profile) {
    throw new Error("Profile not found");
  }

  const age = calculateAge(user.dateOfBirth);

  return {
    user,
    profile,
    age,
  };
};



export { createUser, loginUser, getUserProfile };
