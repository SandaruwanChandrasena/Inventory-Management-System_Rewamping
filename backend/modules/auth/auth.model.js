import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    idNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["admin", "manager", "employee"],
      default: "employee",
    },

    accountStatus: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },

    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
