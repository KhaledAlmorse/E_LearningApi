import mongoose from "mongoose";
import { type } from "node:os";

export const userRoles = {
  ADMIN: "admin",
  INSTRUCTOR: "instructor",
  STUDENT: "student",
};

export const defulatSecure_Url =
  "https://res.cloudinary.com/dihye61vh/image/upload/v1778587556/default-avatar-icon-of-social-media-user-vector_popy0a.jpg";

export const defulatPublic_Id =
  "default-avatar-icon-of-social-media-user-vector_popy0a";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      trim: true,
      maxLength: [50, "First Name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      trim: true,
      maxLength: [50, "Last Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: Object.values(userRoles),
      default: userRoles.STUDENT,
    },
    // avatar: {
    //   type: String,
    //   default:
    //     "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    // },
    bio: {
      type: String,
      maxLength: [500, "Bio cannot exceed 500 characters"],
    },
    // isActive: {
    //   type: Boolean,
    //   default: true,
    // },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isLoggedIn: { type: Boolean, default: false },
    lastLoginAt: {
      type: Date,
    },
    profilePicture: {
      secure_url: { type: String, default: defulatSecure_Url },
      public_id: { type: String, default: defulatPublic_Id },
    },
    freezed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
