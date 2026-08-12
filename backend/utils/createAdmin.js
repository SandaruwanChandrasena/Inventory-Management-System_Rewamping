import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../modules/auth/auth.model.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = await User.create({
      firstName: "System",
      lastName: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      phoneNumber: "0771234567",
      idNumber: "ADMIN001",
      bio: "System Administrator",
      profileImage: "",
      role: "admin",
      accountStatus: "active",
      tokenVersion: 0
    });

    console.log("Admin created:", admin.email);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();

//admin@example.com
//Admin@123