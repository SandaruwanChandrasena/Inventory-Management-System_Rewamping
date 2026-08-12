import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./auth.model.js";

const createUser = async ({
  firstName,
  lastName,
  email,
  password,
  phoneNumber,
  idNumber,
  bio,
  profileImage,
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

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phoneNumber,
    idNumber,
    bio,
    profileImage,
    role,
  });

  return user;
};

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

export { createUser, loginUser };
