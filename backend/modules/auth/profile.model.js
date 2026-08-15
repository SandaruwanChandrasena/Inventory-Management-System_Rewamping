import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    phoneNumber: {
      type: String,
      trim: true,
      default: "",
    },

    gender: {
      type: String,
      enum: ["","male", "female", "other"],
      default: "",
    },

    maritalStatus: {
      type: String,
      enum: ["","single", "married"],
      default: "",
    },

    address: {
      type: String,
      trim: true,
      default: "",
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
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;