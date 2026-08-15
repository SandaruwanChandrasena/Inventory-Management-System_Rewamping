import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./auth.model.js";
import Profile from "./profile.model.js";
import calculateAge from "../../utils/calculateAge.js";
import supabase from "../../config/supabase.js";



/* Create a new user - A/ M */
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

/* Login user - A/ M/ E */
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

/* Profile Management */

/* Get user profile - A/ M/ E */
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

  let profileImageUrl = "";

  if (profile.profileImage) {
    const { data, error } = await supabase.storage
      .from("profile-images")
      .createSignedUrl(profile.profileImage, 3600);

    if (error) {
      throw new Error(`Unable to load profile image: ${error.message}`);
    }

    profileImageUrl = data.signedUrl;
  }

  return {
    user,
    profile: {
      ...profile.toObject(),
      profileImage: profileImageUrl,
    },
    age,
  };
};
/* Update user profile - A/ M/ E */
const updateProfile = async (userId, profileData) => {
  const allowedFields = [
    "phoneNumber",
    "gender",
    "maritalStatus",
    "address",
    "bio",
    "profileImage",
  ];

  const updates = {};

  for (const field of allowedFields) {
    if (profileData[field] !== undefined) {
      updates[field] = profileData[field];
    }
  }

  const profile = await Profile.findOneAndUpdate(
    { user: userId },
    { $set: updates },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!profile) {
    throw new Error("Profile not found");
  }

  return profile;
};
/* Upload profile image - A/ M/ E */
const uploadProfileImage = async (userId, file) => {
  if (!file) {
    throw new Error("Profile image is required");
  }

  const profile = await Profile.findOne({ user: userId });

  if (!profile) {
    throw new Error("Profile not found");
  }

  const fileExtension = file.originalname.split(".").pop();

  const filePath = `profiles/${userId}/${Date.now()}.${fileExtension}`;

  const { error } = await supabase.storage
    .from("profile-images")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }

  profile.profileImage = filePath;

  await profile.save();

  return profile;
};


/* User Management */

/* Get all users - A/ M */
const getAllUsers = async (currentUserRole) => {
  const filter = {};

  // Manager cannot see Admin users
  if (currentUserRole === "manager") {
    filter.role = { $ne: "admin" };
  }

  const users = await User.find(filter)
    .select("-password -tokenVersion")
    .sort({ createdAt: -1 });

  return users;
};


/* Get user details - A/M */
const getUserById = async (userId, currentUserRole) => {
  const user = await User.findById(userId)
    .select("-password -tokenVersion");

  if (!user) {
    throw new Error("User not found");
  }

  // Manager cannot view Admin details
  if (currentUserRole === "manager" && user.role === "admin") {
    throw new Error("You do not have permission to view this user");
  }

  return user;
};


/* Update user by Admin or Manager - A/ M */
const updateUser = async (userId, currentUserRole, updateData) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Admin cannot update another Admin
  if (user.role === "admin") {
    throw new Error("Admin users cannot be updated");
  }

  // Manager can only update employees
  if (currentUserRole === "manager" && user.role !== "employee") {
    throw new Error("Manager can only update employees");
  }

  let allowedFields = [];

  // Admin can update these fields
  if (currentUserRole === "admin") {
    allowedFields = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "idNumber",
      "role",
      "accountStatus",
    ];
  }

  // Manager can update these fields
  if (currentUserRole === "manager") {
    allowedFields = [
      "firstName",
      "lastName",
      "accountStatus",
    ];
  }

  const updates = {};

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      updates[field] = updateData[field];
    }
  }

  // Validate role changes made by Admin
  if (
    currentUserRole === "admin" &&
    updates.role !== undefined &&
    !["manager", "employee"].includes(updates.role)
  ) {
    throw new Error("Invalid role");
  }

  // Validate account status
  if (
    updates.accountStatus !== undefined &&
    !["active", "blocked"].includes(updates.accountStatus)
  ) {
    throw new Error("Invalid account status");
  }

  // Check duplicate email/ID if needed later
  if (updates.idNumber) {
    const existingIdNumber = await User.findOne({
      idNumber: updates.idNumber,
      _id: { $ne: userId },
    });

    if (existingIdNumber) {
      throw new Error("ID number already exists");
    }
  }

  Object.assign(user, updates);

  await user.save();

  return user;
};


/* Permanently delete user */
const deleteUser = async (userId, currentUserRole) => {
  // Only Admin can permanently delete users
  if (currentUserRole !== "admin") {
    throw new Error("Only admin can delete users");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Admin cannot delete another Admin
  if (user.role === "admin") {
    throw new Error("Admin users cannot be deleted");
  }

  // Find user's profile
  const profile = await Profile.findOne({ user: userId });

  // Delete profile image from Supabase if it exists
  if (profile && profile.profileImage) {
    const { error } = await supabase.storage
      .from("profile-images")
      .remove([profile.profileImage]);

    if (error) {
      throw new Error(
        `Profile image deletion failed: ${error.message}`
      );
    }
  }

  // Delete profile
  if (profile) {
    await Profile.deleteOne({ user: userId });
  }

  // Delete user
  await User.deleteOne({ _id: userId });

  return user;
};


export { createUser, loginUser, getUserProfile, updateProfile, uploadProfileImage, getAllUsers, getUserById, updateUser, deleteUser };
